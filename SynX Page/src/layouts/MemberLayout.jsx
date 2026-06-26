import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import SynxLogo from '../components/common/SynxLogo';

const MemberLayout = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('synx_token');
    localStorage.removeItem('synx_user');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Inicio', path: '/member/home', icon: Home },
    { name: 'Clases', path: '/member/classes', icon: Calendar },
    { name: 'Perfil', path: '/member/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-[#040508] text-[#F8FAFC] flex flex-col font-sans pb-24 sm:pb-0 selection:bg-[#6D5DF6]/30">
      
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] left-[-8%] w-[280px] h-[280px] bg-[#6D5DF6] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.12] animate-pulse" style={{animationDuration:'6s'}} />
        <div className="absolute bottom-[5%] right-[-8%] w-[320px] h-[320px] bg-[#3A4C8C] rounded-full mix-blend-screen filter blur-[140px] opacity-[0.12] animate-pulse" style={{animationDuration:'8s'}} />
        <div className="absolute top-[60%] left-[50%] -translate-x-1/2 w-[200px] h-[200px] bg-[#6D5DF6] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.06]" />
      </div>

      {}
      <header className="h-16 flex items-center justify-between px-5 border-b border-[#1E2330] bg-[#12151D]/60 backdrop-blur-2xl sticky top-0 z-50">
        <SynxLogo className="w-24 h-auto drop-shadow-[0_0_10px_rgba(109,93,246,0.2)]" />
        <motion.button 
          onClick={handleLogout} 
          whileHover={{ scale: 1.08 }} 
          whileTap={{ scale: 0.92 }}
          className="p-2.5 text-[#D7DCE8]/50 hover:text-[#FF4757] transition-all rounded-xl hover:bg-[#FF4757]/10 border border-transparent hover:border-[#FF4757]/20"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </header>

      {}
      <main className="flex-1 w-full max-w-md mx-auto px-5 py-6 overflow-y-auto relative z-10">
        <Outlet />
      </main>

      {}
      <nav className="fixed bottom-0 w-full sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 z-50">
        {}
        <div className="h-8 bg-gradient-to-t from-[#040508] to-transparent pointer-events-none" />
        <div className="relative bg-[#0A0C14]/90 backdrop-blur-2xl border-t border-[#1E2330]/80 flex justify-around items-stretch h-[76px] px-2 rounded-t-3xl shadow-[0_-15px_50px_rgba(4,5,8,0.9)]">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.name} to={item.path} className="relative flex flex-col items-center justify-center flex-1 group">
                
                {}
                {isActive && (
                  <motion.div
                    layoutId="memberNavGlow"
                    className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C]"
                    style={{ boxShadow: '0 0 14px 2px rgba(109,93,246,0.5), 0 0 30px 4px rgba(109,93,246,0.15)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}

                {}
                {isActive && (
                  <div className="absolute top-3 w-10 h-10 rounded-full bg-[#6D5DF6]/10 blur-xl pointer-events-none" />
                )}

                {}
                <motion.div
                  animate={isActive ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="relative z-10 mb-1"
                >
                  <item.icon
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${isActive ? 'text-[#F8FAFC] drop-shadow-[0_0_8px_rgba(109,93,246,0.6)]' : 'text-[#D7DCE8]/35 group-hover:text-[#D7DCE8]/60'}`}
                    strokeWidth={isActive ? 2.2 : 1.5}
                  />
                </motion.div>

                {}
                <span className={`text-[10px] font-bold relative z-10 transition-all duration-200 ${isActive ? 'text-[#F8FAFC]' : 'text-[#D7DCE8]/35 group-hover:text-[#D7DCE8]/60'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MemberLayout;
