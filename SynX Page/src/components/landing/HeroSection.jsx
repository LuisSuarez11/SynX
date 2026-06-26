import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';


function MagneticButton({ children, href, className }) {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = buttonRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = () => {
    buttonRef.current.style.transform = 'translate(0, 0)';
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.2s ease-out' }}
    >
      {children}
    </a>
  );
}


function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-2xl mx-auto"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute -inset-4 bg-[#6D5DF6]/15 blur-[60px] rounded-3xl pointer-events-none"></div>

      <div className="relative bg-[#0a0a0a] border border-[#1E2330] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20">
        {}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E2330] bg-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <div className="flex-1 mx-4">
            <div className="bg-white/5 border border-[#1E2330] rounded-lg px-4 py-1 text-center">
              <span className="font-mono-tech text-[10px] text-[#D7DCE8]/80">app.synx.io/dashboard</span>
            </div>
          </div>
        </div>

        {}
        <div className="p-4 md:p-6 grid grid-cols-12 gap-3 md:gap-4 min-h-[280px] md:min-h-[340px]">
          {}
          <div className="col-span-3 space-y-3">
            <div className="w-full h-6 bg-[#6D5DF6]/20 rounded-lg border border-[#6D5DF6]/20 flex items-center justify-center">
              <span className="text-[8px] text-[#6D5DF6] font-bold tracking-wider">SYNX</span>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-full h-4 rounded-md ${i === 0 ? 'bg-[#6D5DF6]/20 border border-[#6D5DF6]/20' : 'bg-white/5'}`}></div>
            ))}
            <div className="mt-4 pt-3 border-t border-[#1E2330] space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-3/4 h-3 bg-white/5 rounded-sm"></div>
              ))}
            </div>
          </div>

          {}
          <div className="col-span-9 space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-28 h-5 bg-white/10 rounded-md"></div>
              <div className="flex gap-2">
                <div className="w-16 h-5 bg-[#6D5DF6]/20 rounded-md border border-[#6D5DF6]/20"></div>
                <div className="w-16 h-5 bg-white/5 rounded-md"></div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-white/5 border border-[#1E2330] rounded-xl p-3"
              >
                <div className="w-8 h-2 bg-[#6D5DF6]/30 rounded-full mb-2"></div>
                <div className="text-[#F8FAFC] font-black text-sm md:text-lg">1,247</div>
                <div className="w-12 h-1.5 bg-green-500/30 rounded-full mt-1"></div>
              </motion.div>
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="bg-white/5 border border-[#1E2330] rounded-xl p-3"
              >
                <div className="w-6 h-2 bg-[#6D5DF6]/30 rounded-full mb-2"></div>
                <div className="text-[#F8FAFC] font-black text-sm md:text-lg">$8.4k</div>
                <div className="w-10 h-1.5 bg-[#6D5DF6]/30 rounded-full mt-1"></div>
              </motion.div>
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="bg-white/5 border border-[#1E2330] rounded-xl p-3"
              >
                <div className="w-10 h-2 bg-[#6D5DF6]/30 rounded-full mb-2"></div>
                <div className="text-[#F8FAFC] font-black text-sm md:text-lg">98.2%</div>
                <div className="w-14 h-1.5 bg-green-500/30 rounded-full mt-1"></div>
              </motion.div>
            </div>

            {}
            <div className="bg-white/[0.03] border border-[#1E2330] rounded-xl p-3 md:p-4 flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="w-20 h-3 bg-white/10 rounded-sm"></div>
                <div className="flex gap-1">
                  <div className="w-6 h-4 bg-[#6D5DF6]/20 rounded text-[6px] text-[#6D5DF6] flex items-center justify-center">7D</div>
                  <div className="w-6 h-4 bg-white/5 rounded text-[6px] text-[#D7DCE8]/60 flex items-center justify-center">30D</div>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-16 md:h-24">
                {[35, 55, 42, 70, 50, 85, 60, 90, 75, 65, 80, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#6D5DF6]/30 to-[#3A4C8C]/80 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
            </div>

            {}
            <div className="space-y-1.5 hidden md:block">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/[0.02] rounded-lg px-3 py-2"
                >
                  <div className="w-6 h-6 rounded-full bg-[#6D5DF6]/20 border border-[#6D5DF6]/20 shrink-0"></div>
                  <div className="w-20 h-2 bg-white/10 rounded-sm"></div>
                  <div className="flex-1"></div>
                  <div className={`w-14 h-4 rounded-full text-[7px] flex items-center justify-center font-bold ${i === 1 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {i === 1 ? 'PENDIENTE' : 'ACTIVO'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#040508]">
      
      {}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-[120%] object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
      </motion.div>

      <div className="absolute inset-0 grid-lines z-[1] pointer-events-none opacity-60"></div>
      <div className="absolute inset-0 dotted-lines z-[1] pointer-events-none"></div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-12"
        style={{ opacity: contentOpacity }}
      >
        {}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-[#6D5DF6]/30 bg-[#6D5DF6]/5 rounded-full backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="font-mono-tech text-xs text-[#6D5DF6] uppercase tracking-widest">SISTEMA MULTI-TENANT 
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#F8FAFC] leading-[0.92] mb-8">
            <motion.span
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              CENTRALIZA
            </motion.span>
            <motion.span
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] via-violet-400 to-[#3A4C8C]"
            >
              TU CENTRO.
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mb-10 text-base md:text-lg font-mono-tech text-[#D7DCE8] max-w-xl mx-auto leading-relaxed"
          >
            Plataforma SaaS multi-tenant que centraliza la administración operativa y financiera de tu gimnasio sin depender de un hardware cerrado.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6D5DF6] text-[#F8FAFC] font-bold text-lg rounded-full hover:bg-[#6D5DF6] hover:shadow-[0_0_35px_rgba(109, 93, 246,0.45)] transition-all duration-300"
            >
              Inicia tu prueba gratis
            </MagneticButton>
            <MagneticButton
              href="/#solucion"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#1E2330] text-[#F8FAFC] font-semibold text-lg rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Ver cómo funciona
            </MagneticButton>
          </motion.div>
        </div>

        <DashboardMockup />
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-mono-tech text-[10px] text-[#D7DCE8]/80 uppercase tracking-widest">Desplazar</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border border-[#1E2330] rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-[#6D5DF6] rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
