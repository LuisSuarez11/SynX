import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Users, Calendar, CreditCard, BarChart2, Globe, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SynxLogo from '../components/common/SynxLogo';


const AnimatedTopoBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let time = 0;

    const draw = () => {
      
      ctx.fillStyle = '#040508'; 
      ctx.fillRect(0, 0, width, height);

      
      const lines = 45;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 20) {
          
          const y = height * 0.5 
            + Math.sin(x * 0.003 + time) * 120 
            + Math.sin(x * 0.008 - time * 0.5 + i * 0.1) * 80
            + Math.cos(x * 0.002 + time * 0.2) * 50
            + (i - lines/2) * 25;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        
        const isCyan = i % 3 === 0;
        ctx.strokeStyle = isCyan ? 'rgba(58, 76, 140, 0.2)' : 'rgba(109, 93, 246, 0.15)'; 
        ctx.lineWidth = isCyan ? 1.5 : 1;
        ctx.stroke();
      }

      time += 0.005; 
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040508]/30 via-[#040508]/80 to-[#040508] lg:bg-gradient-to-r lg:from-[#040508] lg:via-[#040508]/80 lg:to-transparent pointer-events-none" />
    </div>
  );
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [tenantName, setTenantName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const endpoint = isLogin ? `${baseUrl}/login` : `${baseUrl}/register`;
      
      const payload = isLogin 
        ? { login_id: email, password } 
        : { tenant_name: tenantName, name, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[Object.keys(data.errors)[0]][0] || 'Error en la autenticación');
      }

      
      localStorage.setItem('synx_token', data.access_token);
      localStorage.setItem('synx_user', JSON.stringify(data.user));

      
      if (data.user.role === 'owner' || data.user.role === 'manager') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else {
        navigate('/member/home');
      }
      
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const AtleticLogo = () => (
    <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10">
      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 28 L20 12 L28 28" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 28 L20 18 L24 28" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 20 L30 20" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-x-hidden bg-[#040508] text-[#F8FAFC] selection:bg-[#6D5DF6]/30">
      
      {}
      <AnimatedTopoBackground />

      {}
      <div className="absolute top-0 w-full z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 relative">
            
            <div className="w-8 md:hidden"></div> {}

            {}
            <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <SynxLogo className="w-40 md:w-48 h-auto drop-shadow-[0_0_15px_rgba(109,93,246,0.3)] hover:scale-105 transition-transform cursor-pointer" />
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      {}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 flex-1 flex flex-col-reverse lg:flex-row items-center justify-between py-10 lg:py-0">
        
        {}
        <div className="w-full lg:w-[50%] flex flex-col justify-center pr-0 lg:pr-12 mt-16 sm:mt-20 lg:mt-0 text-center lg:text-left">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start"
          >
            <p className="text-[9px] sm:text-[10px] font-black text-[#D7DCE8]/80 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-8 ml-0 lg:ml-1 mt-8 lg:mt-0">
              Software para centros deportivos
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold tracking-tight mb-4 sm:mb-6 text-[#F8FAFC] leading-[1.1] lg:leading-[1.05]">
              Tu centro.<br className="hidden sm:block" />
              Todo en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C] italic">sincronía.</span>
            </h1>

            <p className="text-[#D7DCE8] text-sm sm:text-base lg:text-lg max-w-sm lg:max-w-md mb-8 sm:mb-12 font-light leading-relaxed mx-auto lg:mx-0">
              Gestiona miembros, reservas, entrenadores, pagos y más. Todo lo que tu centro deportivo necesita, en una sola plataforma.
            </p>
            
            {}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0">
              {[
                { icon: Users, label: 'Gestión de\nmiembros' },
                { icon: Calendar, label: 'Reservas\ninteligentes' },
                { icon: CreditCard, label: 'Pagos y\nsuscripciones' },
                { icon: BarChart2, label: 'Reportes y\nanálisis' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-[#1E2330] bg-[#12151D] flex items-center justify-center group-hover:border-[#6D5DF6]/50 group-hover:bg-[#6D5DF6]/10 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(109,93,246,0.3)]">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D7DCE8] group-hover:text-[#6D5DF6] transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-[#D7DCE8]/80 font-medium leading-tight text-center whitespace-pre-line group-hover:text-[#F8FAFC] transition-colors">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-[#1E2330] bg-[#12151D]/50 backdrop-blur-md max-w-sm sm:max-w-lg shadow-xl hover:border-[#3A4C8C]/50 transition-all cursor-default w-full mx-auto lg:mx-0 text-left"
            >
              <div className="flex-1 flex gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl font-serif text-[#3A4C8C]/80 leading-none">"</span>
                <p className="text-[11px] sm:text-[13px] text-[#D7DCE8] mb-0 leading-relaxed pt-1">
                  SynX ha transformado la forma en que gestionamos nuestro centro. Más tiempo para entrenar, menos para administrar."
                </p>
              </div>
              <div className="flex flex-col items-center justify-center pl-4 sm:pl-6 border-l border-[#1E2330] min-w-[90px] sm:min-w-[120px]">
                <div className="text-[#D7DCE8]/80 mb-1 sm:mb-2">
                  <AtleticLogo />
                </div>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#D7DCE8]/80 font-semibold text-center leading-tight">
                  Atletic Club<br/>Madrid
                </span>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center lg:justify-end mt-12 lg:mt-0">
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[440px] bg-[#12151D]/80 backdrop-blur-2xl border border-[#1E2330] rounded-[2rem] p-8 sm:p-10 shadow-[0_15px_50px_rgba(4,5,8,0.8)] relative"
          >
            {}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D5DF6]/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3A4C8C]/15 rounded-full blur-[40px] pointer-events-none" />
            
            {}
            <div className="relative flex p-1 bg-[#040508]/50 rounded-2xl mb-8 border border-[#1E2330] shadow-inner">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-[13px] font-bold relative z-10 transition-colors duration-300 ${isLogin ? 'text-[#F8FAFC]' : 'text-[#D7DCE8]/60 hover:text-[#D7DCE8]'}`}
              >
                Iniciar sesión
                {isLogin && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C] rounded-xl -z-10 shadow-[0_0_15px_rgba(109,93,246,0.4)]"
                  />
                )}
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-[13px] font-bold relative z-10 transition-colors duration-300 ${!isLogin ? 'text-[#F8FAFC]' : 'text-[#D7DCE8]/60 hover:text-[#D7DCE8]'}`}
              >
                Crear cuenta
                {!isLogin && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C] rounded-xl -z-10 shadow-[0_0_15px_rgba(109,93,246,0.4)]"
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                  
                  {}
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/50 text-red-400 text-[12px] p-3 rounded-xl text-center"
                    >
                      {errorMsg}
                    </motion.div>
                  )}

                  {}
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      {}
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#D7DCE8]">Nombre del Gimnasio</label>
                        <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === 'tenant' ? 'border-[#6D5DF6] bg-[#6D5DF6]/5 shadow-[0_0_10px_rgba(109,93,246,0.2)]' : 'border-[#1E2330] bg-[#040508]/50 hover:border-[#3A4C8C]/50'}`}>
                          <div className="pl-4 pr-3">
                            <BarChart2 className={`w-4 h-4 ${focusedField === 'tenant' ? 'text-[#6D5DF6]' : 'text-[#D7DCE8]/60'}`} />
                          </div>
                          <input
                            type="text"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            onFocus={() => setFocusedField('tenant')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-transparent py-3.5 pr-4 text-[#F8FAFC] text-[13px] focus:outline-none placeholder-[#D7DCE8]/30"
                            placeholder="Ej. AESGYM"
                            required={!isLogin}
                          />
                        </div>
                      </div>

                      {}
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#D7DCE8]">Nombre del Propietario</label>
                        <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === 'name' ? 'border-[#6D5DF6] bg-[#6D5DF6]/5 shadow-[0_0_10px_rgba(109,93,246,0.2)]' : 'border-[#1E2330] bg-[#040508]/50 hover:border-[#3A4C8C]/50'}`}>
                          <div className="pl-4 pr-3">
                            <User className={`w-4 h-4 ${focusedField === 'name' ? 'text-[#6D5DF6]' : 'text-[#D7DCE8]/60'}`} />
                          </div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-transparent py-3.5 pr-4 text-[#F8FAFC] text-[13px] focus:outline-none placeholder-[#D7DCE8]/30"
                            placeholder="Tu nombre completo"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {}
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#D7DCE8]">
                      {isLogin ? 'Email o Carnet de Identidad' : 'Correo electrónico'}
                    </label>
                    <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === 'email' ? 'border-[#3A4C8C] bg-[#3A4C8C]/10 shadow-[0_0_10px_rgba(58,76,140,0.2)]' : 'border-[#1E2330] bg-[#040508]/50 hover:border-[#3A4C8C]/50'}`}>
                      <div className="pl-4 pr-3">
                        <Mail className={`w-4 h-4 ${focusedField === 'email' ? 'text-[#3A4C8C]' : 'text-[#D7DCE8]/60'}`} />
                      </div>
                      <input
                        type={isLogin ? "text" : "email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent py-3.5 pr-4 text-[#F8FAFC] text-[13px] focus:outline-none placeholder-[#D7DCE8]/30"
                        placeholder={isLogin ? "ejemplo@email.com o 1234567" : "tu@email.com"}
                        required
                      />
                    </div>
                  </div>

                  {}
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#D7DCE8]">Contraseña</label>
                    <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focusedField === 'password' ? 'border-[#6D5DF6] bg-[#6D5DF6]/5 shadow-[0_0_10px_rgba(109,93,246,0.2)]' : 'border-[#1E2330] bg-[#040508]/50 hover:border-[#3A4C8C]/50'}`}>
                      <div className="pl-4 pr-3">
                        <Lock className={`w-4 h-4 ${focusedField === 'password' ? 'text-[#6D5DF6]' : 'text-[#D7DCE8]/60'}`} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent py-3.5 text-[#F8FAFC] text-[13px] focus:outline-none placeholder-[#D7DCE8]/30"
                        placeholder="••••••••"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="pr-4 pl-2 text-[#D7DCE8]/60 hover:text-[#F8FAFC] transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex justify-start pt-1">
                      <a href="#" className="text-[12px] text-[#D7DCE8]/80 hover:text-[#3A4C8C] transition-colors">¿Olvidaste tu contraseña?</a>
                    </div>
                  )}

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 bg-[#F8FAFC] text-[#040508] hover:bg-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(248,250,252,0.1)] flex justify-center items-center gap-2 text-[14px] ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {loading ? 'Procesando...' : (isLogin ? 'Iniciar sesión' : 'Crear cuenta')}
                      {!loading && (
                        <motion.svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </motion.svg>
                      )}
                    </motion.button>
                  </div>

                  {}
                  <div className="relative py-4 flex items-center">
                    <div className="flex-grow border-t border-[#1E2330]"></div>
                    <span className="flex-shrink-0 mx-4 text-[11px] text-[#D7DCE8]/60 uppercase tracking-widest">o continúa con</span>
                    <div className="flex-grow border-t border-[#1E2330]"></div>
                  </div>

                  {}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button whileHover={{ y: -2 }} type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1E2330] bg-[#040508]/50 hover:bg-[#1E2330] transition-all shadow-md text-[13px] font-medium text-[#D7DCE8]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </motion.button>
                    <motion.button whileHover={{ y: -2 }} type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1E2330] bg-[#040508]/50 hover:bg-[#1E2330] transition-all shadow-md text-[13px] font-medium text-[#D7DCE8]">
                      <svg className="w-4 h-4" viewBox="0 0 21 21" fill="currentColor">
                        <path d="M10 0H0v10h10V0z" fill="#f25022"/>
                        <path d="M21 0H11v10h10V0z" fill="#7fba00"/>
                        <path d="M10 11H0v10h10V11z" fill="#00a4ef"/>
                        <path d="M21 11H11v10h10V11z" fill="#ffb900"/>
                      </svg>
                      Microsoft
                    </motion.button>
                  </div>

                  <div className="pt-4 text-center">
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[13px] text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">
                      {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                      <span className="text-[#6D5DF6] font-bold hover:text-[#3A4C8C] transition-colors">{isLogin ? "Crear cuenta" : "Iniciar sesión"}</span>
                    </button>
                  </div>

                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {}
      <div className="relative z-10 border-t border-[#1E2330] bg-[#040508]/80 backdrop-blur-md mt-auto">
        <div className="max-w-[1300px] mx-auto px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <SynxLogo className="w-16 h-auto grayscale opacity-50" />
            <p className="text-[11px] text-[#D7DCE8]/60 font-mono-tech uppercase tracking-wider">
              © {new Date().getFullYear()} SynX. Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[11px] text-[#D7DCE8]/80 font-mono-tech uppercase tracking-wider">
            <a href="#" className="hover:text-[#6D5DF6] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#6D5DF6] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#6D5DF6] transition-colors">Ayuda</a>
            <div className="flex items-center gap-1 sm:ml-2 sm:border-l border-[#1E2330] sm:pl-6 text-[#D7DCE8]/60 cursor-not-allowed">
              <Globe className="w-3.5 h-3.5" />
              <span>ES ∨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
