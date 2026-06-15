import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, Users, Clock, Shield } from 'lucide-react';

// contador q se anima cuando lo ves en pantalla
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// testimonios de gyms de santa cruz
const testimonials = [
  {
    name: 'Belen Fitness Center',
    role: 'Santa Cruz, Bolivia',
    initials: 'BF',
    color: 'from-purple-600 to-purple-900',
    quote: 'SynX transformó por completo la gestión de nuestro centro. El control de membresías es automático y ya no perdemos ingresos por vencimientos no detectados. Nuestros socios están más satisfechos que nunca.',
    rating: 5,
  },
  {
    name: 'Aesgym',
    role: 'Santa Cruz, Bolivia',
    initials: 'AG',
    color: 'from-blue-600 to-blue-900',
    quote: 'Lo mejor de SynX es que funciona con los lectores NFC que ya teníamos. Sin invertir en hardware nuevo, en menos de una semana ya teníamos todo operativo y completamente digitalizado.',
    rating: 5,
  },
  {
    name: 'Megafit Legacy',
    role: 'Santa Cruz, Bolivia',
    initials: 'ML',
    color: 'from-emerald-600 to-emerald-900',
    quote: 'Gestionamos todas nuestras sedes desde un solo panel. Los planes familiares y la cancelación autónoma redujeron las quejas de clientes en un 60%. SynX es el futuro del fitness en Bolivia.',
    rating: 5,
  },
  {
    name: 'Fitbull',
    role: 'Santa Cruz, Bolivia',
    initials: 'FB',
    color: 'from-orange-500 to-red-800',
    quote: 'El módulo de reservas y control de aforo en tiempo real cambió totalmente nuestra operación diaria. Nuestros entrenadores y recepcionistas ahora tienen más tiempo para atender a los clientes.',
    rating: 5,
  },
];

const metrics = [
  { icon: TrendingUp, value: 500, suffix: '+', label: 'Gimnasios gestionados' },
  { icon: Users, value: 120000, suffix: '+', label: 'Miembros activos' },
  { icon: Clock, value: 99.9, suffix: '%', label: 'Uptime garantizado' },
  { icon: Shield, value: 40, suffix: '%', prefix: '-', label: 'Reducción de costos' },
];

export default function SocialProof() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // va cambiando el testimonio resaltado cada 5 seg
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonios" className="relative bg-black border-t border-white/10 overflow-hidden py-24">
      <div className="absolute inset-0 grid-lines pointer-events-none z-0 opacity-30"></div>
      
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop"
          alt="Interior de gimnasio moderno"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(60%) brightness(0.12)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest">Prueba Social</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            Resultados que <span className="text-purple-400">hablan.</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Gimnasios de Santa Cruz ya confían en SynX para transformar su gestión operativa.
          </p>
        </div>

        {/* metricas con contadores */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center group hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-500"
            >
              <metric.icon className="w-5 h-5 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                <AnimatedCounter target={metric.value} suffix={metric.suffix} prefix={metric.prefix || ''} />
              </div>
              <p className="font-mono-tech text-[10px] text-slate-500 uppercase tracking-widest">{metric.label}</p>
            </div>
          ))}
        </motion.div>

        {/* cards de testimonios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative bg-white/[0.03] border rounded-2xl p-6 transition-all duration-500 group hover:bg-purple-500/5 ${
                activeTestimonial === i
                  ? 'border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.08)]'
                  : 'border-white/10'
              }`}
            >
              {activeTestimonial === i && (
                <motion.div
                  layoutId="testimonial-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-purple-500 rounded-full"
                />
              )}

              <Quote className="w-7 h-7 text-purple-500/20 mb-4" />

              <p className="text-slate-300 text-sm leading-relaxed mb-5 italic flex-1">
                "{t.quote}"
              </p>

              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* logo del gym con iniciales */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <span className="text-white font-black text-xs tracking-tight">{t.initials}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{t.name}</p>
                  <p className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* puntitos del autoplay */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                activeTestimonial === i ? 'w-8 bg-purple-500' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ver testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
