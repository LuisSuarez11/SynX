import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  CalendarDays, 
  ScanLine, 
  Settings, 
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Briefcase,
  Tag,
  Building2
} from 'lucide-react';
import SynxLogo from '../components/common/SynxLogo';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('synx_user'));
  const branches = user?.tenant?.branches || [];
  
  const isOwner = user?.role === 'owner';
  const isManager = user?.role === 'manager';

  // selectedBranch es null si es "General", o el objeto branch si es una específica
  const [selectedBranch, setSelectedBranch] = useState(() => {
    // Si es manager, forzamos la selección a su primera (y única) sucursal si la tiene
    if (isManager && branches.length > 0) {
      // Buscar la sucursal asignada o tomar la primera
      return branches.find(b => b.id === user.branch_id) || branches[0];
    }
    return null;
  });
  
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ... (keep the rest the same until the branch selector)
  
  // Navigation
  const navItems = [
    { name: 'Dashboard',        path: '/admin/dashboard',    icon: LayoutDashboard },
    { name: 'Miembros',         path: '/admin/members',      icon: Users },
    { name: 'Suscripciones',    path: '/admin/subscriptions',icon: CreditCard },
    { name: 'Planes',           path: '/admin/memberships',  icon: Tag },
    { name: 'Control de Acceso',path: '/admin/attendance',   icon: ScanLine },
    { name: 'Clases',           path: '/admin/classes',      icon: CalendarDays },
  ];

  if (isOwner) {
    navItems.push({ name: 'Sucursales',    path: '/admin/branches',  icon: Building2 });
    navItems.push({ name: 'Personal',      path: '/admin/staff',    icon: Briefcase });
    navItems.push({ name: 'Configuración', path: '/admin/settings', icon: Settings });
  }

  const handleLogout = () => {
    localStorage.removeItem('synx_token');
    localStorage.removeItem('synx_user');
    window.location.href = '/login';
  };

  const SidebarContent = () => (
    <>
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 justify-between md:justify-start">
        <Link to="/admin/dashboard" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
          <SynxLogo className="w-28 h-auto" />
        </Link>
        <button className="md:hidden text-[#D7DCE8]/70 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-[#6D5DF6]/10 text-[#6D5DF6] border border-[#6D5DF6]/20 shadow-[0_0_15px_rgba(109,93,246,0.1)]' 
                : 'text-[#D7DCE8]/60 hover:text-[#F8FAFC] hover:bg-[#1E2330]/30'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#6D5DF6]' : ''}`} />
              <span className="text-[14px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button (Mobile Only) */}
      <div className="p-4 md:hidden border-t border-[#1E2330]/50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#D7DCE8]/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[14px] font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#040508] text-[#F8FAFC] flex font-sans overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 bg-[#0A0C14] flex-col hidden md:flex relative z-40 border-r border-[#1E2330]">
        <SidebarContent />
      </aside>

      {/* SIDEBAR (Mobile Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#040508]/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0A0C14] flex flex-col z-50 border-r border-[#1E2330] shadow-2xl md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#040508] relative">
        
        {/* FONDOS ANIMADOS (GLOWING ORBS) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ 
              x: [0, 100, -50, 0], 
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#6D5DF6] rounded-full mix-blend-screen filter blur-[150px] opacity-10"
          ></motion.div>
          <motion.div 
            animate={{ 
              x: [0, -150, 100, 0], 
              y: [0, 100, -100, 0],
              scale: [1, 0.8, 1.3, 1] 
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[20%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#3A4C8C] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08]"
          ></motion.div>
        </div>

        {/* TOPBAR */}
        <header className="h-20 flex items-center justify-between px-4 lg:px-10 relative z-30 bg-[#040508]/50 backdrop-blur-md border-b border-[#1E2330]/50">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Menu (Mobile) */}
            <button 
              className="md:hidden p-2 text-[#D7DCE8]/70 hover:text-white transition-colors rounded-lg bg-[#0A0C14] border border-[#1E2330]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Branch Selector */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => isOwner && setShowBranchMenu(!showBranchMenu)}
                className={`flex items-center justify-between w-56 md:w-64 px-4 py-2 rounded-xl bg-[#0A0C14] border border-[#1E2330] transition-colors ${isOwner ? 'hover:border-[#3A4C8C] cursor-pointer' : 'cursor-default opacity-80'}`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-[#D7DCE8]/50 uppercase tracking-widest font-semibold mb-0.5">Sucursal Activa:</span>
                  <span className="text-[14px] font-bold text-[#F8FAFC] truncate max-w-[120px] md:max-w-none">{selectedBranch ? selectedBranch.name : 'General (Todas)'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#D7DCE8]/60 flex-shrink-0" />
              </button>

              {/* Dropdown Menu */}
              {showBranchMenu && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-[#1E2330] bg-[#0A0C14] shadow-xl overflow-hidden py-2 z-50 max-h-64 overflow-y-auto custom-scrollbar">
                  <button 
                    onClick={() => {setSelectedBranch(null); setShowBranchMenu(false);}} 
                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#6D5DF6]/10 hover:text-[#6D5DF6] ${selectedBranch === null ? 'text-[#F8FAFC] font-bold bg-[#1E2330]/30' : 'text-[#D7DCE8]'}`}
                  >
                    General (Todas)
                  </button>
                  {branches.map(branch => (
                    <button 
                      key={branch.id}
                      onClick={() => {setSelectedBranch(branch); setShowBranchMenu(false);}} 
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#6D5DF6]/10 hover:text-[#6D5DF6] ${selectedBranch?.id === branch.id ? 'text-[#F8FAFC] font-bold bg-[#1E2330]/30' : 'text-[#D7DCE8]'}`}
                    >
                      {branch.name}
                    </button>
                  ))}
                  {branches.length === 0 && (
                    <div className="px-4 py-2 text-[12px] text-[#D7DCE8]/50">No hay sucursales</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right TopBar Area */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Header Right */}
            <div className="flex items-center gap-3">
              {/* User Profile Dropdown */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6D5DF6] to-[#3A4C8C] flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(109,93,246,0.2)] border border-[#6D5DF6]/50 flex-shrink-0">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden lg:flex flex-col mr-2">
                <span className="text-[13px] font-bold leading-tight">{user?.name || 'Saul Camacho'}</span>
                <span className="text-[10px] text-[#D7DCE8]/50 uppercase tracking-widest">{user?.role || 'Owner'}</span>
              </div>
              {/* Botón de Cerrar Sesión Desktop */}
              <button 
                onClick={handleLogout}
                className="ml-2 p-2 hover:bg-[#FF4757]/10 text-[#D7DCE8]/50 hover:text-[#FF4757] rounded-xl transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Branch Selector */}
        <div className="sm:hidden px-4 py-3 bg-[#0A0C14]/50 border-b border-[#1E2330]/50 flex justify-between items-center z-20 relative">
          <span className="text-[11px] text-[#D7DCE8]/60 uppercase tracking-widest font-semibold">Sucursal:</span>
          <button 
            onClick={() => isOwner && setShowBranchMenu(!showBranchMenu)} 
            className={`flex items-center gap-1 text-[13px] font-bold text-[#F8FAFC] ${isOwner ? '' : 'cursor-default'}`}
          >
            {selectedBranch ? selectedBranch.name : 'General (Todas)'} 
            {isOwner && <ChevronDown className="w-3 h-3 text-[#6D5DF6]" />}
          </button>
        </div>
        {/* Dropdown Menu for Mobile */}
        {showBranchMenu && (
          <div className="sm:hidden absolute top-[115px] left-4 right-4 rounded-xl border border-[#1E2330] bg-[#0A0C14] shadow-xl overflow-hidden py-2 z-50 max-h-60 overflow-y-auto">
            <button 
              onClick={() => {setSelectedBranch(null); setShowBranchMenu(false);}} 
              className={`w-full text-left px-4 py-3 text-[13px] hover:bg-[#6D5DF6]/10 hover:text-[#6D5DF6] border-b border-[#1E2330]/50 ${selectedBranch === null ? 'text-[#F8FAFC] font-bold bg-[#1E2330]/30' : 'text-[#D7DCE8]'}`}
            >
              General (Todas)
            </button>
            {branches.map(branch => (
              <button 
                key={branch.id}
                onClick={() => {setSelectedBranch(branch); setShowBranchMenu(false);}} 
                className={`w-full text-left px-4 py-3 text-[13px] hover:bg-[#6D5DF6]/10 hover:text-[#6D5DF6] border-b border-[#1E2330]/50 last:border-0 ${selectedBranch?.id === branch.id ? 'text-[#F8FAFC] font-bold bg-[#1E2330]/30' : 'text-[#D7DCE8]'}`}
              >
                {branch.name}
              </button>
            ))}
            {branches.length === 0 && (
              <div className="px-4 py-3 text-[12px] text-[#D7DCE8]/50 text-center">No hay sucursales</div>
            )}
          </div>
        )}

        {/* PAGE CONTENT */}
        <div className="flex-1 p-4 md:p-6 lg:px-10 pb-10 overflow-y-auto relative z-20">
          <Outlet context={{ selectedBranch }} />
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;
