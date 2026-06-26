import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, Briefcase, MapPin, Check } from 'lucide-react';
import api from '../../services/api';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const currentUser = JSON.parse(localStorage.getItem('synx_user') || '{}');
  const availableBranches = currentUser?.tenant?.branches || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch_id: ''
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/staff');
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      
      if (editingStaff) {
        if (!payload.password) delete payload.password; 
        await api.put(`/admin/staff/${editingStaff.id}`, payload);
      } else {
        await api.post('/admin/staff', payload);
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', branch_id: '' });
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("Error al guardar. Revisa los datos o si el correo ya existe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar a este encargado? Perderá acceso inmediatamente.")) return;
    try {
      await api.delete(`/admin/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      branch_id: member.branch_id || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#F8FAFC] tracking-tight">Gestión de Personal</h1>
          <p className="text-[14px] text-[#D7DCE8]/60">Administra a los encargados (managers) de tus sucursales.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setEditingStaff(null);
              setFormData({ name: '', email: '', password: '', branch_id: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-colors shadow-[0_0_15px_rgba(109,93,246,0.2)] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nuevo Encargado
          </button>
        </div>
      </div>

      {}
      <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C14]/50 z-10 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" />
          </div>
        ) : staff.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D7DCE8]/50">
            <Briefcase className="w-12 h-12 mb-4 opacity-20" />
            <p>No tienes encargados registrados</p>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E2330] bg-[#12151D]/50">
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider">Encargado</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider">Sucursal Asignada</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2330]">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-[#12151D]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#6D5DF6]/20 flex items-center justify-center text-[#6D5DF6] font-bold text-sm border border-[#6D5DF6]/50">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#F8FAFC] text-[14px]">{member.name}</div>
                        <div className="text-[12px] text-[#D7DCE8]/50">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#3A4C8C]/20 text-[#6D5DF6] border border-[#6D5DF6]/30">
                      Manager
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[13px] text-[#F8FAFC]">
                      <MapPin className="w-4 h-4 text-[#D7DCE8]/50" />
                      {member.branch?.name || 'Sin Asignar'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(member)} className="p-2 text-[#D7DCE8]/50 hover:text-[#6D5DF6] hover:bg-[#6D5DF6]/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="p-2 text-[#D7DCE8]/50 hover:text-[#FF4757] hover:bg-[#FF4757]/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0C14] border border-[#1E2330] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#1E2330] bg-[#12151D]/50">
                <h3 className="text-xl font-bold text-[#F8FAFC]">
                  {editingStaff ? 'Editar Encargado' : 'Nuevo Encargado'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#D7DCE8]/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors"
                      placeholder="Ej: Laura Pérez"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Correo</label>
                      <input 
                        type="email" required value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors"
                        placeholder="laura@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">
                        Contraseña {editingStaff && <span className="text-[10px] lowercase normal-case opacity-60">(Dejar vacío para no cambiar)</span>}
                      </label>
                      <input 
                        type="password" required={!editingStaff} value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Asignar a Sucursal</label>
                    <select
                      required value={formData.branch_id}
                      onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="">-- Selecciona una sucursal --</option>
                      {availableBranches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2330]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-[#D7DCE8]/70 hover:text-white hover:bg-[#1E2330] transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingStaff ? 'Guardar Cambios' : 'Crear Encargado'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffPage;
