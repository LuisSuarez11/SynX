import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, Check, Tag, Clock, Zap } from 'lucide-react';
import api from '../../services/api';

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', type: 'time_based', duration_days: '', credits_amount: '' });

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/memberships');
      setMemberships(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMemberships(); }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: '', description: '', price: '', type: 'time_based', duration_days: '', credits_amount: '' });
    setIsModalOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setFormData({ name: m.name, description: m.description || '', price: m.price, type: m.type, duration_days: m.duration_days || '', credits_amount: m.credits_amount || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, price: parseFloat(formData.price) };
      if (payload.type === 'time_based') delete payload.credits_amount;
      else delete payload.duration_days;
      if (editing) await api.put(`/admin/memberships/${editing.id}`, payload);
      else await api.post('/admin/memberships', payload);
      setIsModalOpen(false);
      fetchMemberships();
    } catch (err) { alert('Error al guardar el plan.'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este plan? Los miembros con este plan no serán afectados.')) return;
    try { await api.delete(`/admin/memberships/${id}`); fetchMemberships(); }
    catch (err) { alert('No se pudo eliminar. Puede que tenga suscripciones activas.'); }
  };

  const typeLabel = (type) => type === 'time_based' ? 'Por Tiempo' : 'Por Créditos';
  const typeIcon = (type) => type === 'time_based' ? Clock : Zap;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#F8FAFC] tracking-tight">Planes y Membresías</h1>
          <p className="text-[14px] text-[#D7DCE8]/60">Define los planes de membresía que ofrecerás a tus clientes.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-colors shadow-[0_0_15px_rgba(109,93,246,0.2)] whitespace-nowrap">
          <Plus className="w-4 h-4" /> Nuevo Plan
        </button>
      </div>

      {}
      {loading ? (
        <div className="flex items-center justify-center h-60"><Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" /></div>
      ) : memberships.length === 0 ? (
        <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl flex flex-col items-center justify-center h-60 text-[#D7DCE8]/30">
          <Tag className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No tienes planes creados todavía</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {memberships.map((m, i) => {
            const TypeIcon = typeIcon(m.type);
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-6 relative overflow-hidden group hover:border-[#6D5DF6]/30 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#6D5DF6]/5 rounded-full blur-[40px]" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#6D5DF6]/15 border border-[#6D5DF6]/20 flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-[#6D5DF6]" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(m)} className="p-1.5 text-[#D7DCE8]/50 hover:text-[#6D5DF6] hover:bg-[#6D5DF6]/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m.id)} className="p-1.5 text-[#D7DCE8]/50 hover:text-[#FF4757] hover:bg-[#FF4757]/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="text-[16px] font-bold text-[#F8FAFC] mb-1 relative z-10">{m.name}</h3>
                {m.description && <p className="text-[12px] text-[#D7DCE8]/50 mb-4 relative z-10 line-clamp-2">{m.description}</p>}
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#1E2330] relative z-10">
                  <div>
                    <p className="text-[28px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] to-[#D7DCE8]/70">Bs {m.price}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#D7DCE8]/40 uppercase tracking-wider block">{typeLabel(m.type)}</span>
                    <span className="text-[13px] font-bold text-[#F8FAFC]">
                      {m.type === 'time_based' ? `${m.duration_days} días` : `${m.credits_amount} créditos`}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0C14] border border-[#1E2330] rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-[#1E2330] bg-[#12151D]/50">
                <h3 className="text-xl font-bold text-[#F8FAFC]">{editing ? 'Editar Plan' : 'Nuevo Plan de Membresía'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#D7DCE8]/50 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Nombre del Plan</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Plan Mensual, Plan Anual..."
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Descripción (opcional)</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Acceso ilimitado a todas las instalaciones..."
                    className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Precio (Bs)</label>
                    <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="150.00"
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Tipo</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none">
                      <option value="time_based">Por Tiempo</option>
                      <option value="credit_based">Por Créditos</option>
                    </select>
                  </div>
                </div>
                {formData.type === 'time_based' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Duración (días)</label>
                    <input required type="number" min="1" value={formData.duration_days} onChange={e => setFormData({...formData, duration_days: e.target.value})}
                      placeholder="30"
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-[#D7DCE8]/60 uppercase tracking-wider mb-1.5">Créditos / Visitas</label>
                    <input required type="number" min="1" value={formData.credits_amount} onChange={e => setFormData({...formData, credits_amount: e.target.value})}
                      placeholder="20"
                      className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#6D5DF6]/50 focus:outline-none" />
                  </div>
                )}
                <div className="flex gap-3 pt-2 border-t border-[#1E2330]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#D7DCE8]/70 hover:bg-[#1E2330] transition-colors">Cancelar</button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#6D5DF6] hover:bg-[#5B4BE5] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editing ? 'Guardar Cambios' : 'Crear Plan'}
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

export default MembershipsPage;
