import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MoreHorizontal, Edit2, Trash2, X, Loader2, User, Mail, CreditCard, Activity, Check, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const MembersPage = () => {
  const { selectedBranch } = useOutletContext();
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ci_number: '',
    branch_id: '',
    membership_id: ''
  });

  // Modal Renovar State
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewingMember, setRenewingMember] = useState(null);
  const [renewFormData, setRenewFormData] = useState({
    membership_id: '',
    register_payment: true,
    payment_method: 'efectivo'
  });

  // Sucursales disponibles (del usuario logueado)
  const currentUser = JSON.parse(localStorage.getItem('synx_user') || '{}');
  const availableBranches = currentUser?.tenant?.branches || [];

  // Cargar Miembros
  const fetchMembers = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (selectedBranch) params.branch_id = selectedBranch.id;

      const response = await api.get('/admin/members', { params });
      setMembers(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar Membresías (Planes) para el form
  const fetchMemberships = async () => {
    try {
      const response = await api.get('/admin/memberships');
      // Asegurarnos de usar los datos correctos si viene paginado o no
      setMemberships(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching memberships:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchMemberships();
  }, [selectedBranch, search, statusFilter]);

  // Manejar el submit del form (Crear / Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (selectedBranch) {
        payload.branch_id = selectedBranch.id;
      } else if (!payload.branch_id) {
        alert("Por favor selecciona una sucursal.");
        setIsSubmitting(false);
        return;
      }

      if (editingMember) {
        // Actualizar (No enviamos el membership_id porque no lo soportamos en Update por ahora según el controller)
        delete payload.membership_id; 
        await api.put(`/admin/members/${editingMember.id}`, payload);
      } else {
        // Crear
        await api.post('/admin/members', payload);
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', email: '', ci_number: '', branch_id: '', membership_id: '' });
      setEditingMember(null);
      fetchMembers(currentPage); // Recargar lista
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Error al guardar el miembro. Revisa los datos o si el correo ya existe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este miembro? Esto cancelará su plan actual.")) return;
    
    try {
      await api.delete(`/admin/members/${id}`);
      fetchMembers(currentPage);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  // Abrir modal de edición
  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      ci_number: member.ci_number || '',
      branch_id: member.branch_id || '',
      membership_id: '' // En edición no asignamos membresía nueva por ahora
    });
    setIsModalOpen(true);
  };

  // Abrir modal de renovación
  const openRenewModal = (member) => {
    setRenewingMember(member);
    setRenewFormData({
      membership_id: '',
      register_payment: true,
      payment_method: 'efectivo'
    });
    setIsRenewModalOpen(true);
  };

  // Manejar el submit de renovación
  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        user_id: renewingMember.id,
        branch_id: renewingMember.branch_id,
        ...renewFormData
      };
      await api.post('/admin/subscriptions', payload);
      setIsRenewModalOpen(false);
      setRenewingMember(null);
      fetchMembers(currentPage); // Recargar lista
    } catch (error) {
      console.error("Error renewing subscription:", error);
      alert("Error al renovar el plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#F8FAFC] tracking-tight">Gestión de Miembros</h1>
          <p className="text-[14px] text-[#D7DCE8]/60">Administra los usuarios inscritos y sus planes.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#D7DCE8]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o CI..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0A0C14] border border-[#1E2330] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#6D5DF6]/50 transition-colors w-full sm:w-[250px]"
            />
          </div>
          <button 
            onClick={() => {
              setEditingMember(null);
              setFormData({ name: '', email: '', ci_number: '', branch_id: '', membership_id: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-colors shadow-[0_0_15px_rgba(109,93,246,0.2)] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nuevo Miembro
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setStatusFilter('')} className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${statusFilter === '' ? 'bg-[#6D5DF6]/20 text-[#6D5DF6] border border-[#6D5DF6]/50' : 'bg-[#0A0C14] text-[#D7DCE8]/60 border border-[#1E2330] hover:text-[#F8FAFC]'}`}>Todos</button>
        <button onClick={() => setStatusFilter('active')} className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${statusFilter === 'active' ? 'bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/50' : 'bg-[#0A0C14] text-[#D7DCE8]/60 border border-[#1E2330] hover:text-[#F8FAFC]'}`}>Activos</button>
        <button onClick={() => setStatusFilter('expiring_soon')} className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${statusFilter === 'expiring_soon' ? 'bg-[#F39C12]/20 text-[#F39C12] border border-[#F39C12]/50 shadow-[0_0_10px_rgba(243,156,18,0.1)]' : 'bg-[#0A0C14] text-[#D7DCE8]/60 border border-[#1E2330] hover:text-[#F8FAFC]'}`}>Por Vencer (5 días)</button>
        <button onClick={() => setStatusFilter('expired')} className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${statusFilter === 'expired' ? 'bg-[#FF4757]/20 text-[#FF4757] border border-[#FF4757]/50' : 'bg-[#0A0C14] text-[#D7DCE8]/60 border border-[#1E2330] hover:text-[#F8FAFC]'}`}>Vencidos</button>
      </div>

      {/* Table Container */}
      <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C14]/50 z-10 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D7DCE8]/50">
            <User className="w-12 h-12 mb-4 opacity-20" />
            <p>No se encontraron miembros</p>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E2330] bg-[#12151D]/50">
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider">Miembro</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider">Plan Actual</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-[#D7DCE8]/70 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2330]">
              {members.map((member) => {
                // Obtener suscripción activa y calcular estados
                const today = new Date();
                today.setHours(0,0,0,0);

                const activeSub = member.subscriptions?.find(sub => {
                  if (sub.status !== 'active') return false;
                  if (!sub.end_date) return true;
                  
                  const end = new Date(sub.end_date);
                  end.setHours(0,0,0,0);
                  return end >= today;
                });
                
                const isExpired = !activeSub;

                let isExpiringSoon = false;
                if (activeSub && activeSub.end_date) {
                   const end = new Date(activeSub.end_date);
                   end.setHours(0,0,0,0);
                   const diffTime = end - today;
                   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                   if (diffDays <= 5 && diffDays >= 0) isExpiringSoon = true;
                }

                return (
                  <tr key={member.id} className="hover:bg-[#12151D]/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E2330] flex items-center justify-center text-[#F8FAFC] font-bold text-sm border border-[#1E2330]">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#F8FAFC] text-[14px]">{member.name}</div>
                          <div className="text-[12px] text-[#D7DCE8]/50 mb-0.5">{member.email} • CI: {member.ci_number || '-'}</div>
                          {!selectedBranch && member.branch && (
                             <div className="text-[10px] uppercase tracking-wider font-bold text-[#6D5DF6]/80 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-[#6D5DF6]"></span>
                                {member.branch.name}
                             </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-[#F8FAFC]">
                        {activeSub ? activeSub.membership?.name : (isExpired ? 'Plan Vencido' : 'Sin Plan')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-[#D7DCE8]/70">
                        {activeSub?.end_date ? new Date(activeSub.end_date).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isExpiringSoon ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F39C12]/10 text-[#F39C12] border border-[#F39C12]/20 shadow-[0_0_10px_rgba(243,156,18,0.1)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F39C12]"></span>
                          Por Vencer
                        </span>
                      ) : activeSub ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]"></span>
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FF4757]/10 text-[#FF4757] border border-[#FF4757]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4757]"></span>
                          Vencido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openRenewModal(member)} className="p-2 text-[#2ECC71]/70 hover:text-[#2ECC71] hover:bg-[#2ECC71]/10 rounded-lg transition-colors tooltip-trigger" title="Renovar Plan">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(member)} className="p-2 text-[#D7DCE8]/50 hover:text-[#6D5DF6] hover:bg-[#6D5DF6]/10 rounded-lg transition-colors tooltip-trigger" title="Editar Miembro">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-2 text-[#D7DCE8]/50 hover:text-[#FF4757] hover:bg-[#FF4757]/10 rounded-lg transition-colors tooltip-trigger" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Paginación (Simple) */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#1E2330] flex justify-between items-center bg-[#12151D]/50">
            <button 
              disabled={currentPage === 1}
              onClick={() => fetchMembers(currentPage - 1)}
              className="px-3 py-1 text-[12px] text-[#D7DCE8] bg-[#0A0C14] border border-[#1E2330] rounded-lg disabled:opacity-50 hover:bg-[#1E2330] transition-colors"
            >
              Anterior
            </button>
            <span className="text-[12px] text-[#D7DCE8]/70">Página {currentPage} de {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => fetchMembers(currentPage + 1)}
              className="px-3 py-1 text-[12px] text-[#D7DCE8] bg-[#0A0C14] border border-[#1E2330] rounded-lg disabled:opacity-50 hover:bg-[#1E2330] transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0C14] border border-[#1E2330] rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between p-6 border-b border-[#1E2330] bg-[#12151D]/50">
                <h3 className="text-xl font-bold text-[#F8FAFC]">
                  {editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#D7DCE8]/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Modal */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#D7DCE8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors"
                        placeholder="Ej: Mateo Salazar..."
                      />
                    </div>
                  </div>

                  {/* Email & CI */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#D7DCE8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Carnet (CI)</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-[#D7DCE8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={formData.ci_number}
                          onChange={(e) => setFormData({...formData, ci_number: e.target.value})}
                          className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors"
                          placeholder="Nro de Documento"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sucursal (Solo si estamos en vista General) */}
                  {!selectedBranch && (
                    <div>
                      <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Sucursal de Inscripción</label>
                      <select
                        required
                        value={formData.branch_id}
                        onChange={(e) => setFormData({...formData, branch_id: e.target.value})}
                        className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">-- Selecciona una sucursal --</option>
                        {availableBranches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Plan de Suscripción (Solo al crear) */}
                  {!editingMember && (
                    <div className="pt-2">
                      <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Asignar Plan Inicial (Opcional)</label>
                      <select
                        value={formData.membership_id}
                        onChange={(e) => setFormData({...formData, membership_id: e.target.value})}
                        className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">-- Sin asignar plan --</option>
                        {memberships.map(plan => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} - Bs. {plan.price} ({plan.type === 'time_based' ? `${plan.duration_days} días` : `${plan.credits_amount} créditos`})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Footer Modal */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2330]">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-[#D7DCE8]/70 hover:text-white hover:bg-[#1E2330] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-[0_0_15px_rgba(109,93,246,0.2)] disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingMember ? 'Guardar Cambios' : 'Registrar Miembro'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Renovar Plan */}
      <AnimatePresence>
        {isRenewModalOpen && renewingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsRenewModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0C14] border border-[#1E2330] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#1E2330] bg-[#12151D]/50">
                <h3 className="text-xl font-bold text-[#F8FAFC]">Renovar Plan</h3>
                <button onClick={() => setIsRenewModalOpen(false)} className="text-[#D7DCE8]/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRenewSubmit} className="p-6 space-y-5">
                <div className="bg-[#12151D] border border-[#1E2330] p-4 rounded-xl flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#1E2330] flex items-center justify-center text-[#F8FAFC] font-bold">
                     {renewingMember.name.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-[#F8FAFC] text-[14px]">{renewingMember.name}</p>
                     <p className="text-[12px] text-[#D7DCE8]/50">CI: {renewingMember.ci_number}</p>
                   </div>
                </div>

                <div className="bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 p-3 rounded-lg flex items-start gap-2">
                   <Activity className="w-4 h-4 text-[#6D5DF6] mt-0.5" />
                   <p className="text-[11px] text-[#D7DCE8]/70 leading-relaxed">
                     El nuevo plan comenzará automáticamente cuando finalice el actual (si tiene uno activo), o hoy mismo si está vencido.
                   </p>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Seleccionar Plan</label>
                  <select
                    required
                    value={renewFormData.membership_id}
                    onChange={(e) => setRenewFormData({...renewFormData, membership_id: e.target.value})}
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">-- Selecciona el nuevo plan --</option>
                    {memberships.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - Bs. {plan.price}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3 p-3 bg-[#12151D] border border-[#1E2330] rounded-xl cursor-pointer hover:border-[#6D5DF6]/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={renewFormData.register_payment}
                    onChange={(e) => setRenewFormData({...renewFormData, register_payment: e.target.checked})}
                    className="w-4 h-4 rounded border-[#1E2330] text-[#6D5DF6] focus:ring-[#6D5DF6]/50 bg-[#0A0C14]"
                  />
                  <span className="text-sm font-medium text-[#F8FAFC]">Registrar pago (Bs)</span>
                </label>

                {renewFormData.register_payment && (
                  <div>
                    <label className="block text-[12px] font-bold text-[#D7DCE8]/70 mb-1.5 uppercase tracking-wider">Método de Pago</label>
                    <select
                      value={renewFormData.payment_method}
                      onChange={(e) => setRenewFormData({...renewFormData, payment_method: e.target.value})}
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia / QR</option>
                      <option value="tarjeta">Tarjeta</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2330]">
                  <button 
                    type="button"
                    onClick={() => setIsRenewModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-[#D7DCE8]/70 hover:text-white hover:bg-[#1E2330] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27ae60] text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-[0_0_15px_rgba(46,204,113,0.2)] disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Confirmar Renovación
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

export default MembersPage;
