import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">

          {/* marca */}
          <div>
            <div className="flex items-center mb-5">
              <img 
                src="/synx-logo.png" 
                alt="SynX Logo" 
                className="h-10 w-auto object-contain invert brightness-200 contrast-125 blend-screen"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span style={{display: 'none'}} className="font-display text-2xl font-black text-white tracking-widest">
                SYNX
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Plataforma cloud con API agnóstica para la gestión inteligente de gimnasios y centros deportivos.
            </p>
            <p className="font-mono-tech text-xs text-slate-700 mt-4 uppercase tracking-widest">
              Santa Cruz, Bolivia 🇧🇴
            </p>
          </div>

          {/* links de secciones */}
          <div className="space-y-4">
            <span className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest block">Secciones</span>
            <a href="#solucion" className="block text-sm text-slate-500 hover:text-white transition-colors">Problemática</a>
            <a href="#core" className="block text-sm text-slate-500 hover:text-white transition-colors">Funcionalidades</a>
            <a href="#precios" className="block text-sm text-slate-500 hover:text-white transition-colors">Planes</a>
            <a href="#testimonios" className="block text-sm text-slate-500 hover:text-white transition-colors">Testimonios</a>
            <a href="#contacto" className="block text-sm text-slate-500 hover:text-white transition-colors">Solicitar Acceso</a>
          </div>

          {/* links legales */}
          <div className="space-y-4">
            <span className="font-mono-tech text-[10px] text-purple-400 uppercase tracking-widest block">Legal</span>
            <a href="#terminos" className="block text-sm text-slate-500 hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#privacidad" className="block text-sm text-slate-500 hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#cookies" className="block text-sm text-slate-500 hover:text-white transition-colors">Política de Cookies</a>
            <a href="#contacto" className="block text-sm text-slate-500 hover:text-white transition-colors">Contacto</a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-700 text-xs font-mono-tech uppercase tracking-widest">
            © {new Date().getFullYear()} SynX Technologies. Todos los derechos reservados.
          </p>
          <p className="text-slate-800 text-xs font-mono-tech uppercase tracking-widest">
            React + Tailwind CSS + Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
