import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Plus, Loader2, Clock, Users, X, MapPin } from 'lucide-react';
import api from '../../services/api';

const ClassesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().split('T')[0]);

  const user = JSON.parse(localStorage.getItem('synx_user') || '{}');
  const userBranches = user?.tenant?.branches || [];

  const [formData, setFormData] = useState({
    name: '',
    gym_class_id: '',
    branch_id: userBranches[0]?.id || '',
    instructor_id: user.id || '1',
    is_recurring: true,
    day_of_week: '1',
    specific_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '09:00',
    capacity: '20'
  });

  const diasMapa = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedRes, classRes] = await Promise.all([
        api.get('/admin/schedules'),
        api.get('/admin/classes')
      ]);
      setSchedules(schedRes.data.schedules || []);
      setClasses(classRes.data.classes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/schedules', formData);
      setIsModalOpen(false);
      setFormData({ ...formData, name: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error al programar horario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualReserve = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      
      
      
      await api.post('/admin/reservations', {
        class_schedule_id: selectedSchedule.id,
        user_id: memberSearch,
        date: reservationDate
      });
      alert('Reserva exitosa');
      setIsReserveModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || "Error al reservar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#F8FAFC] tracking-tight">Gestión de Clases</h1>
          <p className="text-[14px] text-[#D7DCE8]/60">Programa horarios y gestiona reservas presenciales.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#6D5DF6] hover:bg-[#5B4BE0] text-white rounded-xl font-bold text-[13px] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Horario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 flex justify-center"><Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" /></div>
        ) : schedules.length === 0 ? (
          <div className="col-span-full py-10 text-center text-[#D7DCE8]/50">No hay clases programadas.</div>
        ) : (
          schedules.map(schedule => (
            <motion.div key={schedule.id} className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-5 hover:border-[#6D5DF6]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#F8FAFC]">{schedule.gym_class?.name || 'Clase'}</h3>
                  <p className="text-[12px] text-[#D7DCE8]/60 mt-0.5">
                    {schedule.is_recurring ? `Cada ${diasMapa[schedule.day_of_week]}` : `Única: ${schedule.specific_date}`}
                  </p>
                </div>
                <div className="bg-[#12151D] px-2.5 py-1 rounded-lg border border-[#1E2330] flex items-center gap-1.5 text-[#2ECC71]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-bold">{schedule.start_time.substring(0,5)}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-[13px] text-[#D7DCE8]/70">
                  <Users className="w-4 h-4 text-[#D7DCE8]/40" /> Capacidad: {schedule.capacity} cupos
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#D7DCE8]/70">
                  <MapPin className="w-4 h-4 text-[#D7DCE8]/40" /> Instructor: {schedule.instructor?.name || 'Sin asignar'}
                </div>
              </div>

              <button 
                onClick={() => { setSelectedSchedule(schedule); setIsReserveModalOpen(true); }}
                className="w-full py-2 bg-[#12151D] hover:bg-[#1E2330] border border-[#1E2330] text-[#D7DCE8] rounded-xl text-[13px] font-bold transition-colors"
              >
                Reservar Miembro Manual
              </button>
            </motion.div>
          ))
        )}
      </div>

      {}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040508]/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0A0C14] border border-[#1E2330] rounded-[24px] w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-[#1E2330] flex justify-between">
                <h3 className="font-bold text-white">Programar Clase</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Nombre de la Clase</label>
                  <input type="text" required placeholder="Ej. Crossfit Extremo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6D5DF6]" />
                </div>
                <div>
                  <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Sucursal</label>
                  <select required value={formData.branch_id} onChange={e => setFormData({...formData, branch_id: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6D5DF6]">
                    <option value="">Seleccione sucursal...</option>
                    {userBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Frecuencia</label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 text-[13px] text-white cursor-pointer">
                      <input type="radio" name="freq" checked={formData.is_recurring} onChange={() => setFormData({...formData, is_recurring: true})} className="accent-[#6D5DF6] w-4 h-4" /> Semanal (Se repite)
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-white cursor-pointer">
                      <input type="radio" name="freq" checked={!formData.is_recurring} onChange={() => setFormData({...formData, is_recurring: false})} className="accent-[#6D5DF6] w-4 h-4" /> Clase Única
                    </label>
                  </div>
                </div>
                
                {formData.is_recurring ? (
                  <div>
                    <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Día de la semana</label>
                    <select value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6D5DF6]">
                      {diasMapa.map((d, i) => <option key={i} value={i}>{d}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Fecha Exacta</label>
                    <input type="date" required value={formData.specific_date} onChange={e => setFormData({...formData, specific_date: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#6D5DF6]" />
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Inicio</label>
                    <input type="time" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Fin</label>
                    <input type="time" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6D5DF6]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Cupos</label>
                    <input type="number" min="1" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6D5DF6]" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#6D5DF6] hover:bg-[#5B4BE0] transition-colors text-white rounded-xl font-bold mt-6 shadow-[0_0_15px_rgba(109,93,246,0.3)]">Guardar Horario</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {isReserveModalOpen && selectedSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040508]/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0A0C14] border border-[#1E2330] rounded-[24px] w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-[#1E2330] flex justify-between">
                <h3 className="font-bold text-white">Reserva Manual: {selectedSchedule.gym_class?.name}</h3>
                <button onClick={() => setIsReserveModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleManualReserve} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">ID del Miembro</label>
                  <input type="text" required placeholder="ID de Usuario" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Fecha de la Clase</label>
                  <input type="date" required value={reservationDate} onChange={e => setReservationDate(e.target.value)} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#2ECC71] text-white rounded-xl font-bold mt-4 shadow-[0_0_15px_rgba(46,204,113,0.3)]">Confirmar Reserva</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ClassesPage;
