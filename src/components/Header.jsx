import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="bg-black/75 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* logo */}
            <motion.a
              href="#"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center"
            >
              <img 
                src="/synx-logo.png" 
                alt="SynX Logo" 
                className="h-12 w-auto object-contain invert brightness-200 contrast-125 blend-screen"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span style={{display: 'none'}} className="font-display text-2xl font-black text-white tracking-widest">
                SYNX
              </span>
            </motion.a>
            
            {/* nav desktop */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex items-center gap-2"
            >
              {[
                { href: '#solucion', label: 'Problemática', code: '01' },
                { href: '#core', label: 'Funcionalidades', code: '02' },
                { href: '#precios', label: 'Modelos', code: '03' },
                { href: '#testimonios', label: 'Testimonios', code: '04' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group px-5 py-2 relative text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <span className="font-mono-tech text-[10px] text-purple-500 mr-1">[{item.code}]</span>
                  {item.label}
                  <span className="absolute bottom-0 left-5 right-5 h-px bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              ))}
              
              <a
                href="#contacto"
                className="ml-4 px-6 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
              >
                Solicitar Acceso
              </a>
            </motion.nav>

            {/* hamburguesa mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2 hover:text-purple-400 transition-colors"
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* menu mobile fullscreen */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-20 bg-black/96 backdrop-blur-xl flex flex-col justify-center items-center gap-8 z-40"
          >
            {[
              { href: '#solucion', label: 'PROBLEMÁTICA', code: '01' },
              { href: '#core', label: 'FUNCIONALIDADES', code: '02' },
              { href: '#precios', label: 'MODELOS', code: '03' },
              { href: '#testimonios', label: 'TESTIMONIOS', code: '04' },
            ].map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-3xl font-bold text-white hover:text-purple-400 transition-colors text-center"
              >
                <span className="font-mono-tech text-[12px] text-purple-500 block mb-1">[{item.code}]</span>
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#contacto"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 px-10 py-4 bg-purple-600 text-white text-lg font-bold rounded-full hover:bg-purple-500 transition-colors"
            >
              Solicitar Acceso
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
