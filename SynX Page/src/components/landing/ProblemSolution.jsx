import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Link as LinkIcon, Lock } from 'lucide-react';

// efecto de luz q sigue el mouse en las cards
function SpotlightCard({ children, className = "" }) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-[#1E2330] bg-[#050505] overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(109, 93, 246,.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(109, 93, 246,.4), transparent 40%)`,
          maskImage: 'linear-gradient(#000, #000) padding-box, linear-gradient(#000, #000)',
          WebkitMaskImage: 'linear-gradient(#000, #000) padding-box, linear-gradient(#000, #000)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          border: '1px solid transparent',
          borderRadius: 'inherit'
        }}
      />
      <div className="relative z-10 h-full w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

// visual del descontrol con errores tipo terminal
const VisualErrors = () => {
  return (
    <div className="w-full h-44 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop"
        alt="Documentos y hojas de cálculo desordenados representando el descontrol administrativo"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(60%) brightness(0.3) contrast(1.2)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
      <div className="absolute inset-0 bg-red-900/10"></div>
      <div className="absolute bottom-0 left-0 w-full p-4 font-mono-tech text-[10px] text-red-500/80">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <p>[SYS_ERR] payment_timeout_exceeded</p>
          <p>[SYS_ERR] missing_renewal_date: id=8923</p>
          <p className="text-red-400 opacity-50">[WARN] unhandled_exception</p>
          <p className="mt-1 text-[#F8FAFC]/50 animate-pulse">_</p>
        </motion.div>
      </div>
    </div>
  );
};

// visual del hacinamiento con foto de gym lleno
const VisualOvercrowd = () => {
  return (
    <div className="w-full h-44 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
        alt="Gimnasio lleno de personas representando hacinamiento"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(50%) brightness(0.35) contrast(1.1)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[#040508]/80 backdrop-blur border border-red-500/50 px-4 py-2 rounded-full text-red-400 font-mono-tech text-[10px] flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <ShieldAlert className="w-3 h-3" />
          CAPACITY OVERLOAD
        </div>
      </div>
    </div>
  );
};

// visual del lock-in con candado
const VisualHardwareLock = () => {
  return (
    <div className="w-full h-44 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=600&auto=format&fit=crop"
        alt="Hardware cerrado con candado representando lock-in tecnológico"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(70%) brightness(0.25) contrast(1.2)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-16 h-16 bg-[#12151D]/90 border-2 border-[#1E2330] rounded-2xl flex items-center justify-center backdrop-blur-sm"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <Lock className="w-7 h-7 text-[#D7DCE8]/80" />
        </motion.div>
      </div>
    </div>
  );
};

// visual de la solucion con nodo central de synx y orbitas
const VisualSaaS = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl">
      <img
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop"
        alt="Equipo trabajando con tecnología cloud"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(40%) brightness(0.2) contrast(1.1)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#12151D]/80 via-black/70 to-black/90"></div>

      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#6D5DF6] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(109, 93, 246,0.5)] z-20"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-black text-[#F8FAFC] text-xl tracking-tighter">SYNX</span>
      </motion.div>

      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#6D5DF6]/20 rounded-full z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#040508]/80 backdrop-blur border border-[#6D5DF6]/50 rounded-xl flex items-center justify-center">
          <Users className="w-4 h-4 text-[#6D5DF6]" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-[#040508]/80 backdrop-blur border border-[#6D5DF6]/50 rounded-xl flex items-center justify-center">
          <LinkIcon className="w-4 h-4 text-[#6D5DF6]" />
        </div>
      </motion.div>

      <div className="absolute bottom-6 left-6 bg-[#040508]/80 backdrop-blur-md border border-[#6D5DF6]/30 p-4 rounded-xl flex items-center gap-4 z-30">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[#F8FAFC] font-mono-tech text-xs tracking-widest uppercase">Cloud Engine Active</span>
      </div>
    </div>
  );
};


export default function ProblemSolution() {
  return (
    <section id="solucion" className="relative bg-[#040508] border-t border-[#1E2330] overflow-hidden py-24">
      <div className="absolute inset-0 grid-lines pointer-events-none z-0 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-[#1E2330] rounded-full mb-6">
            <span className="w-2 h-2 bg-[#6D5DF6] rounded-full"></span>
            <span className="font-mono-tech text-[10px] text-[#D7DCE8] uppercase tracking-widest">Análisis del Problema</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#F8FAFC] tracking-tight leading-tight max-w-2xl">
            El software anticuado frena tu <span className="text-[#D7DCE8]/80">crecimiento.</span>
          </h2>
        </div>

        {/* bento grid de problemas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">
          
          {/* card 1 - descontrol */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-1">
            <SpotlightCard className="h-full group">
              <div className="p-8 pb-0">
                <span className="font-mono-tech text-[10px] text-red-400 mb-4 block uppercase tracking-widest">01 / Evasión</span>
                <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3">Descontrol Administrativo</h3>
                <p className="text-[#D7DCE8] text-sm leading-relaxed mb-6">
                  Pérdidas económicas por vencimientos no detectados y uso de herramientas manuales.
                </p>
              </div>
              <div className="mt-auto">
                <VisualErrors />
              </div>
            </SpotlightCard>
          </motion.div>

          {/* card 2 - hacinamiento */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="md:col-span-1">
            <SpotlightCard className="h-full group">
              <div className="p-8 pb-0">
                <span className="font-mono-tech text-[10px] text-red-400 mb-4 block uppercase tracking-widest">02 / Saturación</span>
                <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3">Hacinamiento de Aforo</h3>
                <p className="text-[#D7DCE8] text-sm leading-relaxed mb-6">
                  Falta de reservas en tiempo real, generando procesos de recepción lentos y saturación.
                </p>
              </div>
              <div className="mt-auto">
                <VisualOvercrowd />
              </div>
            </SpotlightCard>
          </motion.div>

          {/* card 3 - lock-in */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-1">
            <SpotlightCard className="h-full group">
              <div className="p-8 pb-0">
                <span className="font-mono-tech text-[10px] text-red-400 mb-4 block uppercase tracking-widest">03 / Monopolio</span>
                <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3">Hardware Lock-in</h3>
                <p className="text-[#D7DCE8] text-sm leading-relaxed mb-6">
                  Te obligan a comprar costosos torniquetes propietarios para operar tu centro.
                </p>
              </div>
              <div className="mt-auto">
                <VisualHardwareLock />
              </div>
            </SpotlightCard>
          </motion.div>

          {/* card grande - la solucion */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-3">
            <SpotlightCard className="h-full p-8 md:p-12 border-[#6D5DF6]/30 group">
              <div className="grid md:grid-cols-2 gap-10 items-center h-full">
                <div>
                  <span className="font-mono-tech text-[10px] text-[#6D5DF6] mb-4 block uppercase tracking-widest">LA SOLUCIÓN</span>
                  <h3 className="text-3xl md:text-5xl font-black text-[#F8FAFC] mb-6 tracking-tight">
                    Plataforma SaaS Unificada & Agnóstica.
                  </h3>
                  <p className="text-[#D7DCE8] text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                    SynX centraliza tus pagos, membresías ilimitadas y planes por créditos en un solo lugar. 
                    Automatiza el aforo y recibe el ID del usuario desde <strong className="text-[#F8FAFC]">cualquier lector NFC o biométrico actual</strong>, validando todo en tiempo real en la nube.
                  </p>
                  <a href="#core" className="inline-flex items-center gap-2 text-[#6D5DF6] font-semibold hover:text-[#6D5DF6] transition-colors">
                    Explorar Arquitectura Core 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                </div>
                <div className="h-full min-h-[300px] w-full relative">
                  <VisualSaaS />
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
