import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, CheckCircle2, AlertCircle } from 'lucide-react';
import ScrambleText from './ScrambleText';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // validar q el email tenga formato correcto
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (formData.name.trim() === '') {
      errors.name = 'El nombre es un campo obligatorio.';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (formData.email.trim() === '') {
      errors.email = 'El correo electrónico es un campo obligatorio.';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Por favor ingresa un correo electrónico válido (ej: usuario@dominio.com).';
    }

    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFieldErrors(errors);

    // si no hay errores limpia todo y muestra el modal
    if (Object.keys(errors).length === 0) {
      setFormData({ name: '', email: '', phone: '' });
      setFieldErrors({});
      setIsModalOpen(true);
    }
  };

  return (
    <section id="contacto" className="relative bg-black border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 grid-lines pointer-events-none z-0"></div>

      <div className="border-b border-white/10 py-5 px-4 sm:px-8 flex justify-between items-center relative z-10">
        <span className="font-mono-tech text-xs text-purple-400 uppercase tracking-widest">[05] Solicitar acceso</span>
        <span className="font-mono-tech text-xs text-slate-700 uppercase tracking-widest hidden sm:block">synx · contacto</span>
      </div>

      <div className="grid lg:grid-cols-2 relative z-10">
        {/* lado izq con foto de gym */}
        <div className="relative border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden min-h-[400px] lg:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1200&auto=format&fit=crop"
            alt="Gimnasio moderno con equipamiento de última generación"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(70%) contrast(1.1) brightness(0.35)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
          <div className="absolute inset-0 bg-purple-950/20"></div>

          <div className="relative z-10 p-8 md:p-14 flex flex-col justify-end h-full">
            <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95] mb-6">
              Únete a la<br />
              <span className="text-purple-400">nueva era</span><br />
              del fitness tech.
            </h2>

            <p className="text-slate-300 text-base mb-10 max-w-sm leading-relaxed">
              Solicita tu acceso y un especialista de SynX se comunicará contigo en menos de 24 horas para activar tu prueba gratuita.
            </p>

            <div className="space-y-3 font-mono-tech text-xs text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span>Prueba gratuita · 14 días</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Soporte en español 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* lado der con el formulario */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <form onSubmit={handleFormSubmit} noValidate className="space-y-8 relative z-10">

            {/* nombre */}
            <div>
              <label htmlFor="contact-name" className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest mb-3 block">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <div className={`relative border-b-2 transition-colors duration-300 ${fieldErrors.name ? 'border-red-500' : focusedField === 'name' ? 'border-purple-500' : 'border-white/10'}`}>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-4 text-white text-lg focus:outline-none placeholder-slate-700 font-medium"
                  placeholder="Tu nombre completo"
                  required
                />
                {focusedField === 'name' && !fieldErrors.name && (
                  <motion.div
                    layoutId="focus-bar"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  />
                )}
              </div>
              {fieldErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.name}
                </motion.p>
              )}
            </div>

            {/* email */}
            <div>
              <label htmlFor="contact-email" className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest mb-3 block">
                Correo electrónico <span className="text-red-400">*</span>
              </label>
              <div className={`relative border-b-2 transition-colors duration-300 ${fieldErrors.email ? 'border-red-500' : focusedField === 'email' ? 'border-purple-500' : 'border-white/10'}`}>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-4 text-white text-lg focus:outline-none placeholder-slate-700 font-medium"
                  placeholder="tu@correo.com"
                  required
                />
                {focusedField === 'email' && !fieldErrors.email && (
                  <motion.div
                    layoutId="focus-bar"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  />
                )}
              </div>
              {fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </motion.p>
              )}
            </div>

            {/* telefono (opcional) */}
            <div>
              <label htmlFor="contact-phone" className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest mb-3 block">
                Teléfono <span className="text-slate-600">(opcional)</span>
              </label>
              <div className={`relative border-b-2 transition-colors duration-300 ${focusedField === 'phone' ? 'border-purple-500' : 'border-white/10'}`}>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-4 text-white text-lg focus:outline-none placeholder-slate-700 font-medium"
                  placeholder="+591 7XXXXXXX"
                />
                {focusedField === 'phone' && (
                  <motion.div
                    layoutId="focus-bar"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  />
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:bg-purple-500 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all duration-300 flex justify-center items-center gap-3 group mt-2"
            >
              Solicitar acceso gratuito
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <p className="font-mono-tech text-[10px] text-slate-600 uppercase tracking-widest text-center">
              Tus datos están protegidos. No compartimos información con terceros.
            </p>
          </form>
        </div>
      </div>

      {/* modal de exito cuando se envia */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="relative bg-[#0a0a0a] border border-purple-500/30 rounded-2xl max-w-md w-full z-10 shadow-[0_0_80px_rgba(168,85,247,0.1)] overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 z-20"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* imagen del modal */}
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop"
                  alt="Personas entrenando en un gimnasio moderno"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.6) contrast(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.15 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-purple-600/20 border border-purple-500/40 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-[0_0_25px_rgba(168,85,247,0.3)]"
                >
                  <CheckCircle2 className="w-8 h-8 text-purple-400" />
                </motion.div>
              </div>

              <div className="px-8 pb-8 pt-4 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black text-white mb-2">
                  <ScrambleText text="¡Solicitud recibida!" delay={200} />
                </h3>

                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono-tech text-[10px] text-green-400 uppercase tracking-widest">Registrado en el sistema</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Tu solicitud fue procesada correctamente. Un especialista de SynX se comunicará contigo
                  en las próximas <strong className="text-white">24 horas</strong> para activar tu entorno de prueba gratuita.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all duration-300"
                >
                  Entendido
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
