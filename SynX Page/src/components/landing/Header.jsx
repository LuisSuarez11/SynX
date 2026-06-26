import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SynxLogo from '../common/SynxLogo';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="bg-[#040508]/75 backdrop-blur-xl border-b border-[#1E2330]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 relative">
            
            <div className="w-8 md:hidden"></div> {}

            {}
            <motion.Link
              to="/"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <SynxLogo className="w-40 md:w-48 h-auto drop-shadow-[0_0_15px_rgba(109,93,246,0.3)] hover:scale-105 transition-transform" />
            </motion.Link>
            
            {}
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
                  className="group px-4 lg:px-5 py-2 relative text-sm text-[#D7DCE8] hover:text-[#F8FAFC] transition-colors"
                >
                  <span className="font-mono-tech text-[10px] text-[#6D5DF6] mr-1">[{item.code}]</span>
                  {item.label}
                  <span className="absolute bottom-0 left-5 right-5 h-px bg-[#6D5DF6] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              ))}
              
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-[#F8FAFC] text-sm font-semibold rounded-full hover:bg-[#1E2330] transition-colors duration-300 border border-transparent hover:border-[#3A4C8C]"
                >
                  Iniciar Sesión
                </Link>
                <a
                  href="#contacto"
                  className="px-6 py-2.5 bg-[#6D5DF6] text-[#F8FAFC] text-sm font-semibold rounded-full hover:bg-[#6D5DF6] hover:shadow-[0_0_20px_rgba(109,93,246,0.4)] transition-all duration-300"
                >
                  Solicitar Acceso
                </a>
              </div>
            </motion.nav>

            {}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#F8FAFC] p-2 hover:text-[#6D5DF6] transition-colors"
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-20 bg-[#040508]/96 backdrop-blur-xl flex flex-col justify-center items-center gap-6 z-40"
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
                className="text-3xl font-bold text-[#F8FAFC] hover:text-[#6D5DF6] transition-colors text-center"
              >
                <span className="font-mono-tech text-[12px] text-[#6D5DF6] block mb-1">[{item.code}]</span>
                {item.label}
              </motion.a>
            ))}
            
            <div className="flex flex-col items-center gap-4 mt-6 w-full px-8">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 text-center border border-[#1E2330] text-[#F8FAFC] text-lg font-bold rounded-full hover:bg-[#1E2330] transition-colors"
              >
                Iniciar Sesión
              </Link>
              <motion.a
                href="#contacto"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full py-4 text-center bg-[#6D5DF6] text-[#F8FAFC] text-lg font-bold rounded-full hover:bg-[#6D5DF6] transition-colors shadow-[0_0_20px_rgba(109,93,246,0.3)]"
              >
                Solicitar Acceso
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
