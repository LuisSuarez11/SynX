import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Users, Loader2, Sparkles, AlertCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const MemberClassesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [userCredits, setUserCredits] = useState(0);
  const [hasValidPlan, setHasValidPlan] = useState(false);

  const diasMapa = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  const reservationDate = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedRes, dashboardRes] = await Promise.all([
        api.get('/member/schedules'),
        api.get('/member/dashboard') 
      ]);
      setSchedules(schedRes.data.schedules || []);
      
      const membership = dashboardRes.data.membership;
      if (membership.status === 'active') {
        setHasValidPlan(true);
        if (membership.type === 'credit_based') {
          setUserCredits(membership.remaining_credits || 0);
        } else {
          
          setUserCredits('∞');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReserve = async (scheduleId) => {
    setIsSubmitting(true);
    try {
      await api.post('/member/reservations', {
        class_schedule_id: scheduleId,
        date: reservationDate
      });
      alert('¡Reserva confirmada con éxito!');
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.error || "Error al reservar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[26px] font-bold text-[#F8FAFC] tracking-tight">Clases Grupales</h1>
        <p className="text-[14px] text-[#D7DCE8]/60 mt-1">Reserva tu lugar en nuestras clases. Puedes cancelar hasta 4 horas antes.</p>
      </motion.div>

      {}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#12151D] to-[#0A0C14] border border-[#1E2330] rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D5DF6]/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider mb-1">Mis Créditos Disponibles</p>
            {hasValidPlan ? (
              <p className="text-4xl font-black text-[#F8FAFC]">{userCredits} <span className="text-lg text-[#D7DCE8]/40">cupos</span></p>
            ) : (
              <div className="flex items-center gap-2 mt-2 text-[#FF4757]">
                <XCircle className="w-5 h-5" />
                <span className="text-[13px] font-bold">Sin membresía activa</span>
              </div>
            )}
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#6D5DF6]/20 border border-[#6D5DF6]/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#6D5DF6]" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-10 flex justify-center"><Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" /></div>
        ) : schedules.length === 0 ? (
          <div className="col-span-full py-10 text-center text-[#D7DCE8]/50 bg-[#0A0C14] rounded-2xl border border-[#1E2330]">
            <CalendarDays className="w-10 h-10 mx-auto opacity-30 mb-3" />
            No hay clases programadas para tu sucursal aún.
          </div>
        ) : (
          schedules.map((schedule, i) => (
            <motion.div 
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-5 relative overflow-hidden group hover:border-[#6D5DF6]/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#3A4C8C]/20 text-[#3A4C8C] mb-2 uppercase tracking-wider">
                    {diasMapa[schedule.day_of_week]}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#F8FAFC]">{schedule.gym_class?.name || 'Clase'}</h3>
                </div>
                <div className="bg-[#12151D] px-3 py-1.5 rounded-xl border border-[#1E2330] flex flex-col items-center justify-center text-[#2ECC71]">
                  <Clock className="w-4 h-4 mb-0.5" />
                  <span className="text-[13px] font-black">{schedule.start_time.substring(0,5)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[13px] text-[#D7DCE8]/60 mb-6">
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#D7DCE8]/30" /> {schedule.capacity} cupos max</div>
              </div>

              <button 
                onClick={() => handleReserve(schedule.id)}
                disabled={isSubmitting || !hasValidPlan || userCredits === 0}
                className="w-full py-3.5 bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C] text-white rounded-xl font-bold text-[13px] transition-all shadow-[0_0_20px_rgba(109,93,246,0.2)] hover:shadow-[0_0_25px_rgba(109,93,246,0.4)] disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Reservar Mi Cupo (-1 Crédito)'}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberClassesPage;
