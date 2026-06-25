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
  
  // For manual reservation
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState({
    gym_class_id: '',
    instructor_id: '1', // Hardcoded for simplicity or should be selected
    day_of_week: '1',
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
      // Create class if not exists logic could be added, but assuming we pick from list
      if (!formData.gym_class_id) {
        // Quick create class
        const newClass = await api.post('/admin/classes', { name: 'Nueva Clase', description: '' });
        formData.gym_class_id = newClass.data.class.id;
      }
      
      await api.post('/admin/schedules', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error al programar horario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualReserve = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Buscamos al miembro primero (En un flujo real buscaríamos por CI o email y luego mandaríamos su ID)
      // Asumiremos que memberSearch es el ID del miembro para este demo, o buscaríamos primero.
      // Ya que SynX tiene un endpoint, se podría buscar. Por ahora mandaremos memberSearch como user_id
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
                  <p className="text-[12px] text-[#D7DCE8]/60 mt-0.5">{diasMapa[schedule.day_of_week]}</p>
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

      {/* Modal Horario */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040508]/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0A0C14] border border-[#1E2330] rounded-[24px] w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-[#1E2330] flex justify-between">
                <h3 className="font-bold text-white">Programar Clase</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
                {/* Simplified form for brevity */}
                <div>
                  <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Día</label>
                  <select value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white">
                    {diasMapa.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Inicio</label>
                    <input type="time" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-[#D7DCE8]/50 uppercase mb-2">Cupos</label>
                    <input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full bg-[#12151D] border border-[#1E2330] rounded-xl px-4 py-3 text-white" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#6D5DF6] text-white rounded-xl font-bold mt-4">Guardar Horario</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Reserva Manual */}
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
