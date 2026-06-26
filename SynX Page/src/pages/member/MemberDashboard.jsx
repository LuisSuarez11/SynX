import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Clock, Shield, MapPin, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../services/api';


const ScanLineAnimation = () => (
  <motion.div
    className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#6D5DF6] to-transparent rounded-full z-20 pointer-events-none"
    animate={{ top: ['15%', '85%', '15%'] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    style={{ boxShadow: '0 0 12px 3px rgba(109,93,246,0.4)' }}
  />
);


const QRCorners = () => {
  const base = 'absolute w-5 h-5 border-[#6D5DF6]';
  return (
    <>
      <div className={`${base} top-0 left-0 border-t-2 border-l-2 rounded-tl-lg`} />
      <div className={`${base} top-0 right-0 border-t-2 border-r-2 rounded-tr-lg`} />
      <div className={`${base} bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg`} />
      <div className={`${base} bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg`} />
    </>
  );
};

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/member/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching member dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-[#6D5DF6]" />
        </motion.div>
        <p className="text-[#D7DCE8]/50 text-sm mt-4 tracking-wider uppercase font-semibold">Cargando tu perfil...</p>
      </div>
    );
  }

  if (!data) return null;

  const { user, membership } = data;
  const isExpired = membership.status === 'expired';
  const accentColor = isExpired ? '#FF4757' : '#6D5DF6';

  
  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [.22,1,.36,1] } }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

      {}
      <motion.div variants={fadeUp}>
        <h1 className="text-[26px] font-bold text-[#F8FAFC] tracking-tight leading-tight">
          Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C]">{user.name.split(' ')[0]}</span>
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin className="w-3.5 h-3.5 text-[#D7DCE8]/40" />
          <p className="text-[13px] text-[#D7DCE8]/50 font-medium">{user.branch}</p>
        </div>
      </motion.div>

      {}
      <motion.div
        variants={fadeUp}
        className="relative rounded-[1.75rem] overflow-hidden border border-[#1E2330] bg-[#12151D]/80 backdrop-blur-2xl shadow-[0_15px_50px_rgba(4,5,8,0.8)]"
      >
        {}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none" style={{ background: `${accentColor}10` }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#3A4C8C]/10 rounded-full blur-[60px] pointer-events-none" />

        {}
        <div className="relative z-10 flex items-center justify-center gap-2 pt-6 pb-2">
          <Shield className="w-3.5 h-3.5 text-[#D7DCE8]/40" />
          <span className="text-[10px] font-black text-[#D7DCE8]/50 uppercase tracking-[0.25em]">Pase de Acceso</span>
        </div>

        {}
        <div className="relative z-10 flex justify-center px-6 py-4">
          <div className="relative p-1">
            {}
            <motion.div
              className="absolute -inset-3 rounded-3xl opacity-60"
              animate={{ opacity: isExpired ? [0.2, 0.4, 0.2] : [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: `radial-gradient(circle, ${accentColor}20, transparent 70%)`, boxShadow: `0 0 40px ${accentColor}15` }}
            />
            {}
            <div className="relative bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <QRCorners />
              {!isExpired && <ScanLineAnimation />}
              <QRCodeSVG
                value={user.qr_token || 'synx-error'}
                size={190}
                fgColor={isExpired ? '#C0C0C0' : '#040508'}
                level="H"
              />
              {}
              {isExpired && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#040508]/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center"
                >
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <AlertCircle className="w-11 h-11 text-[#FF4757] mb-2" />
                  </motion.div>
                  <p className="text-[#FF4757] font-black text-[13px] uppercase tracking-widest">Acceso Denegado</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="relative z-10 mx-5 mt-2 mb-6">
          {}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#1E2330] to-transparent mb-5" />

          {}
          <div className="flex items-stretch justify-between">
            {}
            <div className="flex-1 flex flex-col items-center text-center px-2">
              <p className="text-[8px] text-[#D7DCE8]/35 uppercase font-black tracking-[0.25em] mb-1.5">Plan</p>
              <p className="text-[14px] font-bold text-[#F8FAFC] leading-tight">{membership.name}</p>
            </div>

            {}
            <div className="w-[1px] bg-[#1E2330] self-stretch my-1" />

            {}
            <div className="flex-1 flex flex-col items-center text-center px-2">
              <p className="text-[8px] text-[#D7DCE8]/35 uppercase font-black tracking-[0.25em] mb-1.5">Vence</p>
              <p className="text-[14px] font-bold text-[#F8FAFC] leading-tight">
                {membership.end_date 
                  ? new Date(membership.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) 
                  : '∞'}
              </p>
            </div>

            {}
            <div className="w-[1px] bg-[#1E2330] self-stretch my-1" />

            {}
            <div className="flex-1 flex flex-col items-center text-center px-2">
              <p className="text-[8px] text-[#D7DCE8]/35 uppercase font-black tracking-[0.25em] mb-1.5">Estado</p>
              {isExpired ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4757] animate-pulse" />
                  <span className="text-[13px] font-black text-[#FF4757]">Vencida</span>
                </div>
              ) : membership.type === 'credit_based' ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#F8FAFC] to-[#D7DCE8]/60 leading-none">{membership.remaining_credits}</span>
                  <span className="text-[9px] text-[#D7DCE8]/40 font-bold uppercase">créditos</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#F8FAFC] to-[#D7DCE8]/60 leading-none">{membership.days_left || '∞'}</span>
                  <span className="text-[9px] text-[#D7DCE8]/40 font-bold uppercase">días</span>
                </div>
              )}
            </div>
          </div>

          {}
          {isExpired && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 w-full py-3.5 bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C] text-white rounded-2xl font-bold text-[13px] transition-all shadow-[0_0_25px_rgba(109,93,246,0.3)] flex items-center justify-center gap-2 border border-[#6D5DF6]/30"
            >
              <Sparkles className="w-4 h-4" />
              Renovar Membresía
              <motion.svg
                className="w-4 h-4"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberDashboard;
