import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, X as XIcon } from 'lucide-react';

export default function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <section id="precios" className="relative bg-[#040508] border-t border-[#1E2330] overflow-hidden">
      <div className="absolute inset-0 grid-lines pointer-events-none z-0"></div>

      {}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1920&auto=format&fit=crop"
          alt="Interior de gimnasio moderno con equipamiento profesional"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(70%) brightness(0.08)' }}
        />
        <div className="absolute inset-0 bg-[#040508]/80"></div>
      </div>

      <div className="border-b border-[#1E2330] py-5 px-4 sm:px-8 flex justify-between items-center relative z-10">
        <span className="font-mono-tech text-xs text-[#6D5DF6] uppercase tracking-widest">[03] MODELOS DE IMPLEMENTACIÓN</span>
        <span className="font-mono-tech text-xs text-[#D7DCE8]/40 uppercase tracking-widest hidden sm:block">synx · licensing</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-[#F8FAFC] tracking-tight mb-4">
            Licenciamiento <span className="text-[#6D5DF6]">SaaS.</span>
          </h2>
          <p className="font-mono-tech text-[#D7DCE8]/80 text-sm max-w-md mx-auto uppercase tracking-widest">
            Escalabilidad garantizada para tu modelo de negocio.
          </p>
        </motion.div>

        {}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredPlan('free')}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`relative p-8 rounded-2xl border transition-all duration-500 ${hoveredPlan === 'free' ? 'border-[#1E2330] bg-white/5' : 'border-[#1E2330] bg-white/[0.02]'}`}
          >
            <div className="mb-8">
              <span className="font-mono-tech text-[10px] text-[#D7DCE8]/60 uppercase tracking-widest block mb-2">Para empezar a explorar</span>
              <h3 className="text-2xl font-bold text-[#F8FAFC]">Plan Freemium</h3>
            </div>

            <div className="mb-8">
              <span className="text-6xl font-black text-[#F8FAFC]">$0</span>
              <span className="text-[#D7DCE8]/80 font-mono-tech text-xs ml-1">/mes</span>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                { text: 'Hasta 50 miembros registrados', included: true },
                { text: 'Panel administrativo básico', included: true },
                { text: 'Control de aforo manual', included: true },
                { text: 'Soporte por email', included: true },
                { text: 'Integración API', included: false },
                { text: 'Multi-sucursal', included: false },
              ].map((item, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${item.included ? 'text-[#D7DCE8]' : 'text-[#D7DCE8]/60 line-through'}`}>
                  {item.included
                    ? <Check className="w-4 h-4 text-[#D7DCE8]/80 shrink-0 mt-0.5" />
                    : <XIcon className="w-4 h-4 text-[#D7DCE8]/40 shrink-0 mt-0.5" />
                  }
                  {item.text}
                </li>
              ))}
            </ul>

            <a
              href="#contacto"
              className="block w-full text-center py-4 border border-[#1E2330] text-[#F8FAFC] font-semibold rounded-xl hover:bg-white hover:text-black transition-all duration-300 font-mono-tech text-xs uppercase tracking-widest"
            >
              Comenzar Gratis
            </a>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onMouseEnter={() => setHoveredPlan('starter')}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden ${hoveredPlan === 'starter' ? 'border-[#6D5DF6]/60 bg-[#6D5DF6]/8 shadow-[0_0_60px_rgba(109, 93, 246,0.12)]' : 'border-[#6D5DF6]/30 bg-[#6D5DF6]/5'}`}
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#6D5DF6]/20 blur-[80px] rounded-full pointer-events-none"></div>

            {}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-[#6D5DF6] rounded-full">
              <Zap className="w-3 h-3 text-[#F8FAFC]" />
              <span className="font-mono-tech text-[10px] text-[#F8FAFC] uppercase tracking-widest font-bold">POPULAR</span>
            </div>

            <div className="relative z-10">
              <div className="mb-8">
                <span className="font-mono-tech text-[10px] text-[#6D5DF6] uppercase tracking-widest block mb-2">Para una sede única</span>
                <h3 className="text-2xl font-bold text-[#F8FAFC]">Licencia Pro</h3>
              </div>

              <div className="mb-8">
                <span className="text-6xl font-black text-[#F8FAFC]">$49</span>
                <span className="text-[#6D5DF6] font-mono-tech text-xs ml-1">/mes</span>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  'Miembros ilimitados',
                  'Gestión de planes híbridos (Ilimitados/Créditos)',
                  'Módulo de reservas y control de aforo',
                  'Cancelación autónoma por usuario',
                  'Soporte a planes familiares',
                  'Panel administrativo y financiero central',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#F8FAFC] text-sm font-medium">
                    <Check className="w-4 h-4 text-[#6D5DF6] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contacto"
                className="block w-full text-center py-4 bg-[#6D5DF6] text-[#F8FAFC] font-bold rounded-xl hover:bg-[#6D5DF6] hover:shadow-[0_0_30px_rgba(109, 93, 246,0.35)] transition-all duration-300 font-mono-tech text-xs uppercase tracking-widest"
              >
                Iniciar Despliegue
              </a>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => setHoveredPlan('enterprise')}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`relative p-8 rounded-2xl border transition-all duration-500 ${hoveredPlan === 'enterprise' ? 'border-[#1E2330] bg-white/5' : 'border-[#1E2330] bg-white/[0.02]'}`}
          >
            <div className="mb-8">
              <span className="font-mono-tech text-[10px] text-[#D7DCE8]/60 uppercase tracking-widest block mb-2">Para cadenas y franquicias</span>
              <h3 className="text-2xl font-bold text-[#F8FAFC]">Licencia Enterprise</h3>
            </div>

            <div className="mb-8">
              <span className="text-6xl font-black text-[#F8FAFC]">$99</span>
              <span className="text-[#D7DCE8]/80 font-mono-tech text-xs ml-1">/mes</span>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                'Todas las funciones de la Licencia Pro',
                'Integración API Agnóstica (NFC, Biométrica, QR)',
                'Soporte multi-tenant avanzado',
                'Gestión y sincronización multi-sucursal',
                'Base de datos relacional dedicada',
                'Soporte técnico prioritario 24/7',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#D7DCE8] text-sm">
                  <Check className="w-4 h-4 text-[#D7DCE8]/80 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#contacto"
              className="block w-full text-center py-4 border border-[#1E2330] text-[#F8FAFC] font-semibold rounded-xl hover:bg-white hover:text-black transition-all duration-300 font-mono-tech text-xs uppercase tracking-widest"
            >
              Solicitar Integración API
            </a>
          </motion.div>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 border-t border-b border-[#1E2330] py-5 overflow-hidden"
        >
          <div className="animate-marquee whitespace-nowrap flex gap-16 text-[#D7DCE8]/60 font-mono-tech text-xs uppercase tracking-widest">
            {Array(3).fill([
              'Cero Lock-in de Hardware',
              'API Agnóstica',
              'Control de Aforo',
              'Planes Híbridos',
              'Cancelación Autónoma',
              'Modelo SaaS Multi-tenant',
            ]).flat().map((item, i) => (
              <span key={i} className="flex items-center gap-4">
                <span className="w-1 h-1 bg-[#6D5DF6] rounded-full"></span>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
