import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, MapPin, Building2, Phone, Check } from 'lucide-react';
import api from '../../services/api';

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/branches');
      setBranches(response.data.branches || []);
      
      // Update local storage branches if possible
      const currentUser = JSON.parse(localStorage.getItem('synx_user') || '{}');
      if (currentUser.tenant) {
        currentUser.tenant.branches = response.data.branches || [];
        localStorage.setItem('synx_user', JSON.stringify(currentUser));
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBranch) {
        await api.put(`/admin/branches/${editingBranch.id}`, formData);
      } else {
        await api.post('/admin/branches', formData);
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', address: '', phone: '' });
      setEditingBranch(null);
      fetchBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
      alert("Error al guardar la sucursal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta sucursal? Asegúrate de que no tenga miembros activos.")) return;
    try {
      await api.delete(`/admin/branches/${id}`);
      fetchBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
      alert("No se pudo eliminar la sucursal. Es probable que tenga registros asociados.");
    }
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address || '',
      phone: branch.phone || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#F8FAFC] tracking-tight">Gestión de Sucursales</h1>
          <p className="text-[14px] text-[#D7DCE8]/60">Administra las sedes físicas de tu franquicia.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setEditingBranch(null);
              setFormData({ name: '', address: '', phone: '' });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-[#6D5DF6] hover:bg-[#5B4BE0] text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(109,93,246,0.3)] hover:shadow-[0_0_25px_rgba(109,93,246,0.5)]"
          >
            <Plus className="w-4 h-4" />
            Nueva Sucursal
          </button>
        </div>
      </div>

      {/* Stats/Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-[#6D5DF6]" />
          </div>
          <div>
            <p className="text-[12px] text-[#D7DCE8]/50 font-bold uppercase tracking-wider mb-0.5">Total Sucursales</p>
            <p className="text-[24px] font-black text-[#F8FAFC] leading-none">{branches.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#12151D]/50 border-b border-[#1E2330]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider">Sucursal</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2330]/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    <Loader2 className="w-6 h-6 text-[#6D5DF6] animate-spin mx-auto" />
                  </td>
                </tr>
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Building2 className="w-10 h-10 text-[#D7DCE8]/20 mb-3" />
                      <p className="text-[#D7DCE8]/50 text-sm">No tienes sucursales registradas.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-[#12151D]/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E2330] border border-[#2A3143] flex items-center justify-center flex-shrink-0 text-[#F8FAFC] font-bold text-sm">
                          {branch.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#F8FAFC]">{branch.name}</p>
                          <p className="text-[12px] text-[#D7DCE8]/50 flex items-center gap-1">
                            ID: {branch.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[#D7DCE8]/70">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[13px]">{branch.address || 'No registrada'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[#D7DCE8]/70">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-[13px]">{branch.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(branch)}
                          className="p-2 bg-[#12151D] hover:bg-[#1E2330] text-[#D7DCE8] rounded-xl border border-[#1E2330] transition-colors"
                          title="Editar sucursal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(branch.id)}
                          className="p-2 bg-[#FF4757]/10 hover:bg-[#FF4757]/20 text-[#FF4757] rounded-xl border border-[#FF4757]/20 transition-colors"
                          title="Eliminar sucursal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#040508]/80 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0C14] border border-[#1E2330] rounded-[24px] w-full max-w-md relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-[#1E2330] flex justify-between items-center bg-[#12151D]/50">
                <div>
                  <h3 className="text-[18px] font-bold text-[#F8FAFC]">
                    {editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
                  </h3>
                  <p className="text-[12px] text-[#D7DCE8]/60 mt-1">Completa los datos de la sede física.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#D7DCE8]/50 hover:text-white hover:bg-[#1E2330] rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider mb-2">
                    Nombre de Sucursal <span className="text-[#FF4757]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej. Sede Central"
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[#6D5DF6]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Av. Principal #123"
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[#6D5DF6]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+591 70000000"
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[#6D5DF6]/50 transition-colors"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-[#12151D] hover:bg-[#1E2330] text-[#D7DCE8] border border-[#1E2330] rounded-xl font-bold text-[13px] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#6D5DF6] hover:bg-[#5B4BE0] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingBranch ? 'Guardar Cambios' : 'Crear Sucursal'}
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

export default BranchesPage;
