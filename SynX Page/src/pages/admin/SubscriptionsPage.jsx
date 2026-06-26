import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Loader2, CreditCard, Check, RefreshCw, Ban } from 'lucide-react';
import api from '../../services/api';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({ user_id: '', membership_id: '', branch_id: '', register_payment: true, payment_method: 'efectivo' });

  const currentUser = JSON.parse(localStorage.getItem('synx_user') || '{}');
  const branches = currentUser?.tenant?.branches || [];

  const fetch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const [subRes, memRes, planRes] = await Promise.all([
        api.get('/admin/subscriptions', { params }),
        api.get('/admin/members', { params: { per_page: 100 } }),
        api.get('/admin/memberships'),
      ]);
      setSubscriptions(subRes.data.data || subRes.data);
      setMembers(memRes.data.data || []);
      setMemberships(planRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/subscriptions', formData);
      setIsModalOpen(false);
      setFormData({ user_id: '', membership_id: '', branch_id: '', register_payment: true, payment_method: 'efectivo' });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar suscripción.');
    } finally { setIsSubmitting(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar esta suscripción? El miembro perderá el acceso inmediatamente.')) return;
    try {
      await api.delete(`/admin/subscriptions/${id}`);
      fetch();
    } catch (err) { console.error(err); }
  };

  const statusBadge = (status) => {
    const map = {
      active:  { label: 'Activa',   cls: 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20' },
      expired: { label: 'Vencida',  cls: 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/20' },
      cancelled: { label: 'Cancelada', cls: 'bg-[#D7DCE8]/10 text-[#D7DCE8]/50 border-[#D7DCE8]/10' },
    };
    const s = map[status] || map.cancelled;
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${s.cls}`}>{s.label}</span>;
  };

  const filterBtns = [
    { label: 'Todas', value: '' },
    { label: 'Activas', value: 'active' },
    { label: 'Vencidas', value: 'expired' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#F8FAFC] tracking-tight">Suscripciones</h1>
          <p className="text-[14px] text-[#D7DCE8]/60">Gestiona los planes activos de tus miembros.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-colors shadow-[0_0_15px_rgba(109,93,246,0.2)] whitespace-nowrap">
          <Plus className="w-4 h-4" /> Asignar Plan
        </button>
      </div>

      {}
      <div className="flex gap-2">
        {filterBtns.map(f => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all border ${statusFilter === f.value ? 'bg-[#6D5DF6]/15 border-[#6D5DF6]/30 text-[#F8FAFC]' : 'bg-[#0A0C14] border-[#1E2330] text-[#D7DCE8]/50 hover:text-[#F8FAFC]'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {}
      <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl overflow-hidden min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C14]/60 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E2330] bg-[#12151D]/50">
                {['Miembro', 'Plan', 'Inicio', 'Vencimiento', 'Estado', 'Sucursal', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2330]/50">
              {subscriptions.length === 0 && !loading ? (
                <tr><td colSpan={7} className="text-center py-16 text-[#D7DCE8]/30 text-sm">No hay suscripciones para mostrar</td></tr>
              ) : subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#12151D]/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#6D5DF6]/15 border border-[#6D5DF6]/30 flex items-center justify-center text-[#6D5DF6] text-[11px] font-black flex-shrink-0">
                        {sub.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#F8FAFC]">{sub.user?.name}</p>
                        <p className="text-[11px] text-[#D7DCE8]/40">{sub.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#F8FAFC]">{sub.membership?.name}</td>
                  <td className="px-5 py-4 text-[12px] text-[#D7DCE8]/60">{sub.start_date ? new Date(sub.start_date).toLocaleDateString('es-ES') : '-'}</td>
                  <td className="px-5 py-4 text-[12px] text-[#D7DCE8]/60">{sub.end_date ? new Date(sub.end_date).toLocaleDateString('es-ES') : 'Sin fecha'}</td>
                  <td className="px-5 py-4">{statusBadge(sub.status)}</td>
                  <td className="px-5 py-4 text-[12px] text-[#D7DCE8]/50">{sub.branch?.name || '-'}</td>
                  <td className="px-5 py-4">
                    {sub.status === 'active' && (
                      <button onClick={() => handleCancel(sub.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#D7DCE8]/40 hover:text-[#FF4757] hover:bg-[#FF4757]/10 rounded-lg transition-all">
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0C14] border border-[#1E2330] rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-[#1E2330] bg-[#12151D]/50">
                <h3 className="text-xl font-bold text-[#F8FAFC]">Asignar Plan a Miembro</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#D7DCE8]/50 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Miembro</label>
                  <select required value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none">
                    <option value="">-- Seleccionar miembro --</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name} — CI: {m.ci_number}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Plan de Membresía</label>
                  <select required value={formData.membership_id} onChange={e => setFormData({...formData, membership_id: e.target.value})}
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none">
                    <option value="">-- Seleccionar plan --</option>
                    {memberships.map(m => <option key={m.id} value={m.id}>{m.name} — Bs {m.price} / {m.duration_days} días</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Sucursal</label>
                  <select value={formData.branch_id} onChange={e => setFormData({...formData, branch_id: e.target.value})}
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none">
                    <option value="">-- Sucursal del miembro --</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#12151D] border border-[#1E2330] rounded-xl">
                  <input type="checkbox" id="reg_pay" checked={formData.register_payment}
                    onChange={e => setFormData({...formData, register_payment: e.target.checked})}
                    className="w-4 h-4 rounded accent-[#6D5DF6]" />
                  <label htmlFor="reg_pay" className="text-[13px] text-[#D7DCE8] cursor-pointer">Registrar pago junto con la suscripción</label>
                </div>
                {formData.register_payment && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Método de Pago</label>
                    <select value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})}
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none">
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia bancaria</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="qr">QR / Billetera digital</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-3 pt-2 border-t border-[#1E2330]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#D7DCE8]/70 hover:bg-[#1E2330] transition-colors">Cancelar</button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Confirmar
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

export default SubscriptionsPage;
