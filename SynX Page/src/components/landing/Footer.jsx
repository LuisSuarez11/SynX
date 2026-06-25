import React from 'react';
import SynxLogo from '../common/SynxLogo';

export default function Footer() {
  return (
    <footer className="bg-[#040508] border-t border-[#1E2330] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#6D5DF6]/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">

          {/* marca */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-5">
              <SynxLogo className="w-28 h-auto opacity-90 drop-shadow-[0_0_15px_rgba(109, 93, 246,0.2)]" />
            </div>
            <p className="text-[#D7DCE8]/80 text-sm leading-relaxed max-w-xs">
              Plataforma cloud con API agnóstica para la gestión inteligente de gimnasios y centros deportivos.
            </p>
            <p className="font-mono-tech text-xs text-[#D7DCE8]/40 mt-4 uppercase tracking-widest">
              Santa Cruz, Bolivia 🇧🇴
            </p>
          </div>

          {/* links de secciones */}
          <div className="space-y-4 text-center md:text-left mt-4 md:mt-0">
            <span className="font-mono-tech text-[10px] text-[#6D5DF6] uppercase tracking-widest block">Secciones</span>
            <a href="#solucion" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Problemática</a>
            <a href="#core" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Funcionalidades</a>
            <a href="#precios" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Planes</a>
            <a href="#testimonios" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Testimonios</a>
            <a href="#contacto" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Solicitar Acceso</a>
          </div>

          {/* links legales */}
          <div className="space-y-4 text-center md:text-left mt-4 md:mt-0">
            <span className="font-mono-tech text-[10px] text-[#6D5DF6] uppercase tracking-widest block">Legal</span>
            <a href="#terminos" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Términos de Servicio</a>
            <a href="#privacidad" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Política de Privacidad</a>
            <a href="#cookies" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Política de Cookies</a>
            <a href="#contacto" className="block text-sm text-[#D7DCE8]/80 hover:text-[#F8FAFC] transition-colors">Contacto</a>
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-[#1E2330] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[#D7DCE8]/40 text-xs font-mono-tech uppercase tracking-widest leading-relaxed">
            © {new Date().getFullYear()} SynX Technologies. Todos los derechos reservados.
          </p>
          <p className="text-[#D7DCE8]/30 text-[10px] md:text-xs font-mono-tech uppercase tracking-widest">
            React + Tailwind CSS + Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
