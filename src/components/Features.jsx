import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Database, Smartphone, Network } from 'lucide-react';

// aca van las animaciones q se muestran en el panel derecho

const VisualAPI = () => {
  return (
    <div className="w-full h-full bg-[#030303] flex items-center justify-center p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20"></div>
      <img
        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop"
        alt="Servidor de datos"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(80%) brightness(0.1)' }}
      />
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 w-full max-w-md bg-black/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 font-mono-tech text-[10px] text-slate-400">api_gateway.log</span>
        </div>
        <div className="p-6 font-mono-tech text-xs md:text-sm text-slate-300">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <span className="text-purple-400">POST</span> /v1/auth/nfc-reader
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="mt-2 text-slate-500">
            &#123;
            <br />&nbsp;&nbsp;"device_id": "XR-900",
            <br />&nbsp;&nbsp;"rfid_token": "a8b9c0d1"
            <br />&#125;
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }} className="mt-4 flex items-center gap-2">
            <span className="text-green-400">200 OK</span>
            <span className="text-slate-500">{"->"}
            </span>
            <span className="text-white">ACCESS_GRANTED</span>
          </motion.div>
          <motion.div 
            className="w-full h-1 bg-gradient-to-r from-purple-600 to-transparent mt-6 rounded-full"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
      </div>
    </div>
  );
};

const VisualDashboard = () => {
  return (
    <div className="w-full h-full bg-[#030303] flex items-end justify-center p-8 md:p-12 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
        alt="Panel de analíticas"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(80%) brightness(0.08)' }}
      />
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black/0 to-black/0"></div>
      <div className="relative z-10 w-full max-w-lg flex items-end gap-3 h-64">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-purple-600/20 to-purple-500 rounded-t-sm border-t border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
          >
            <motion.div 
              className="w-full h-full bg-white/10"
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VisualMobile = () => {
  return (
    <div className="w-full h-full bg-[#030303] flex items-center justify-center relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop"
        alt="Persona usando smartphone en gimnasio"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(70%) brightness(0.1)' }}
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <motion.div 
        className="absolute w-[500px] h-[500px] border border-purple-500/20 rounded-full"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative z-10 w-[200px] h-[400px] md:w-[240px] md:h-[480px] bg-black border-[6px] border-slate-800 rounded-[2.5rem] p-4 flex flex-col shadow-2xl">
        <div className="w-20 h-4 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl"></div>
        <div className="mt-8 flex-1 flex flex-col gap-4">
          <div className="w-full h-24 bg-white/5 rounded-xl border border-white/10 p-3 relative overflow-hidden">
            <div className="w-16 h-4 bg-slate-700 rounded-full mb-2"></div>
            <div className="w-24 h-6 bg-purple-500/20 text-purple-400 rounded-full"></div>
            <motion.div 
              className="absolute top-0 right-0 w-2 h-full bg-green-500/50"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <motion.div 
            className="w-full h-12 bg-purple-500/20 rounded-xl border border-purple-500/30 mt-auto flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-purple-400 font-mono-tech text-[9px] uppercase tracking-widest">Reservar Clase</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const VisualNetwork = () => {
  return (
    <div className="w-full h-full bg-[#030303] flex items-center justify-center relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop"
        alt="Cadena de gimnasios con múltiples ubicaciones"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(70%) brightness(0.1)' }}
      />
      <div className="absolute inset-0 bg-black/65"></div>
      <div className="relative w-full max-w-md h-full flex items-center justify-center z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path 
            d="M50 50 L20 20 M50 50 L80 20 M50 50 L20 80 M50 50 L80 80"
            stroke="rgba(168,85,247,0.3)" 
            strokeWidth="0.5" 
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
        <motion.div 
          className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center z-10 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Database className="text-white w-6 h-6" />
        </motion.div>
        <motion.div className="absolute top-[10%] left-[10%] w-10 h-10 bg-slate-900/90 border border-slate-700 rounded-xl backdrop-blur-sm" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.div className="absolute top-[10%] right-[10%] w-10 h-10 bg-slate-900/90 border border-slate-700 rounded-xl backdrop-blur-sm" animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.div className="absolute bottom-[10%] left-[10%] w-10 h-10 bg-slate-900/90 border border-slate-700 rounded-xl backdrop-blur-sm" animate={{ x: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }} />
        <motion.div className="absolute bottom-[10%] right-[10%] w-10 h-10 bg-slate-900/90 border border-slate-700 rounded-xl backdrop-blur-sm" animate={{ x: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
      </div>
    </div>
  );
};

// datos de cada modulo core
const directives = [
  {
    id: 1,
    code: 'API.AGNOSTIC',
    title: 'Integración Agnóstica de Hardware',
    desc: 'SynX recibe el ID del usuario desde cualquier lector (biométrico, NFC, código QR) mediante nuestra API abierta. El sistema valida el estado de la membresía en milisegundos, eliminando completamente el "Lock-in" tecnológico.',
    ui: <VisualAPI />
  },
  {
    id: 2,
    code: 'PLAN.HYBRID',
    title: 'Gestión de Planes Híbridos',
    desc: 'La mayoría de los sistemas solo soportan o mensualidades fijas o pago por clase. Nuestra arquitectura permite operar con ambos simultáneamente en la misma base de datos, sin conflictos administrativos.',
    ui: <VisualDashboard />
  },
  {
    id: 3,
    code: 'BOOK.AUTO',
    title: 'Cancelación Autónoma & Aforo',
    desc: 'Tus usuarios acceden a un portal móvil donde reservan sus clases. Si cancelan antes del tiempo límite, el sistema les devuelve su crédito y libera el cupo para otro miembro. Aforo optimizado automáticamente.',
    ui: <VisualMobile />
  },
  {
    id: 4,
    code: 'NET.FAMILY',
    title: 'Multi-Sucursal y Perfiles Familiares',
    desc: 'Ideal para cadenas en expansión. Asocia múltiples perfiles a un solo titular de facturación y permite que una misma membresía sincronizada abra las puertas de todas tus sedes a nivel regional.',
    ui: <VisualNetwork />
  }
];

export default function Features() {
  const [activeItem, setActiveItem] = useState(0);

  // detectar cual feature esta centrado en pantalla al scrollear
  useEffect(() => {
    const handleScroll = () => {
      const textBlocks = document.querySelectorAll('.feature-text-block');
      const viewportCenter = window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      textBlocks.forEach((block, index) => {
        const rect = block.getBoundingClientRect();
        const blockCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - blockCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveItem(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="core" className="relative bg-black border-t border-white/10 overflow-hidden pt-24 pb-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest">Módulos Core</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Software que se adapta a <span className="text-purple-400">tu hardware.</span>
          </h2>
        </div>

        {/* layout con sticky scroll */}
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          
          {/* columna izq - textos */}
          <div className="lg:w-1/2 py-[10vh] lg:py-[30vh]">
            {directives.map((d, i) => (
              <div 
                key={d.id} 
                className={`feature-text-block min-h-[50vh] lg:min-h-[60vh] flex flex-col justify-center transition-all duration-700 ${activeItem === i ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}
              >
                <span className="font-mono-tech text-[10px] text-purple-400 mb-4 block uppercase tracking-widest border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded-full w-fit">
                  [{d.code}]
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">{d.title}</h3>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
                  {d.desc}
                </p>

                {/* en mobile se muestra aca abajo */}
                <div className="lg:hidden mt-8 w-full h-64 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.08)]">
                  {d.ui}
                </div>
              </div>
            ))}
          </div>

          {/* columna der - panel sticky (solo desktop) */}
          <div className="hidden lg:block lg:w-1/2 sticky top-0 h-screen py-[20vh]">
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#030303] border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {directives[activeItem].ui}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
