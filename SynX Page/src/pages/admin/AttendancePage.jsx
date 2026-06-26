import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ScanLine, CheckCircle2, AlertCircle, Clock, Users, Loader2, CalendarDays, XCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../services/api';

const AttendancePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null); 
  const [attendances, setAttendances] = useState([]);
  const [stats, setStats] = useState({ hoy: 0, semana: 0, mes: 0 });
  const [loadingList, setLoadingList] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showScanner, setShowScanner] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    let html5QrCode;
    
    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (html5QrCode) {
              html5QrCode.stop().then(() => {
                setShowScanner(false);
                setSearchQuery(decodedText);
                handleSearchFromScan(decodedText);
              }).catch(console.error);
            }
          },
          (error) => {  }
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
      }
    };

    if (showScanner) {
      
      setTimeout(startScanner, 100);
    }

    return () => {
      if (html5QrCode) {
        try {
          html5QrCode.stop().catch(e => console.error("Error stopping scanner:", e));
        } catch (e) { }
      }
    };
  }, [showScanner]);

  const { selectedBranch } = (() => {
    try { return { selectedBranch: JSON.parse(localStorage.getItem('synx_selected_branch') || 'null') }; }
    catch { return { selectedBranch: null }; }
  })();

  const fetchAttendances = async () => {
    try {
      setLoadingList(true);
      const params = { date: selectedDate };
      if (selectedBranch) params.branch_id = selectedBranch.id;
      const [attRes, statsRes] = await Promise.all([
        api.get('/admin/attendance', { params }),
        api.get('/admin/attendance/stats', { params: selectedBranch ? { branch_id: selectedBranch.id } : {} })
      ]);
      setAttendances(attRes.data.attendances || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchAttendances(); }, [selectedDate]);

  const executeSearch = async (queryStr) => {
    if (!queryStr) return;
    setIsSearching(true);
    setResult(null);
    try {
      const payload = { search: queryStr };
      const user = JSON.parse(localStorage.getItem('synx_user') || '{}');
      const branches = user?.tenant?.branches || [];
      const branch = branches.find(b => b.id === (selectedBranch?.id));
      if (branch) payload.branch_id = branch.id;

      const res = await api.post('/admin/attendance', payload);
      setResult({ success: true, message: res.data.message, member: res.data.attendance?.user, warning: res.data.warning });
      setSearchQuery('');
      fetchAttendances();
    } catch (err) {
      const errData = err.response?.data;
      setResult({ success: false, message: errData?.error || 'Error al registrar entrada.', member: errData?.member });
    } finally {
      setIsSearching(false);
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(searchQuery.trim());
  };

  const handleSearchFromScan = (decodedText) => {
    executeSearch(decodedText.trim());
  };

  const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">

      {}
      <div>
        <h1 className="text-[28px] font-bold text-[#F8FAFC] tracking-tight">Control de Acceso</h1>
        <p className="text-[14px] text-[#D7DCE8]/60">Registra la entrada de miembros al gimnasio en tiempo real.</p>
      </div>

      {}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Entradas Hoy', value: stats.hoy, icon: ScanLine, color: '#6D5DF6' },
          { label: 'Esta Semana', value: stats.semana, icon: CalendarDays, color: '#3A4C8C' },
          { label: 'Este Mes', value: stats.mes, icon: Users, color: '#2ECC71' },
        ].map((s) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="show"
            className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-4 flex items-center gap-4 hover:border-[#3A4C8C]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[11px] text-[#D7DCE8]/50 font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-[24px] font-black text-[#F8FAFC] leading-tight">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D5DF6]/5 rounded-full blur-[50px]" />

            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#6D5DF6]/15 border border-[#6D5DF6]/30 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-[#6D5DF6]" />
              </div>
              <h2 className="text-[15px] font-bold text-[#F8FAFC]">Registrar Entrada</h2>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider mb-2">Buscar por CI o Nombre</label>
                <div className="relative flex items-center rounded-xl border border-[#1E2330] bg-[#040508]/50 focus-within:border-[#6D5DF6]/50 focus-within:shadow-[0_0_10px_rgba(109,93,246,0.15)] transition-all">
                  <Search className="w-4 h-4 absolute left-4 text-[#D7DCE8]/40" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Ej: 13333358 o Luis Suarez"
                    className="w-full bg-transparent pl-11 pr-4 py-3.5 text-[13px] text-[#F8FAFC] focus:outline-none placeholder-[#D7DCE8]/25"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="submit" disabled={isSearching || !searchQuery.trim()}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 disabled:opacity-40 shadow-[0_0_20px_rgba(109,93,246,0.25)] border border-[#6D5DF6]/30"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                  {isSearching ? 'Procesando...' : 'Registrar'}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setShowScanner(!showScanner)}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="py-3.5 px-4 bg-[#12151D] text-[#D7DCE8] border border-[#1E2330] rounded-xl font-bold text-[13px] hover:text-white transition-colors flex-shrink-0 flex items-center gap-2"
                >
                  <ScanLine className="w-4 h-4" />
                  {showScanner ? 'Cerrar Cámara' : 'Escanear QR'}
                </motion.button>
              </div>
            </form>

            <AnimatePresence>
              {showScanner && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden rounded-xl border border-[#1E2330]"
                >
                  <div id="reader" className="w-full bg-black"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  className={`mt-5 p-4 rounded-xl border flex items-start gap-3 ${result.success
                    ? 'bg-[#2ECC71]/10 border-[#2ECC71]/25 text-[#2ECC71]'
                    : 'bg-[#FF4757]/10 border-[#FF4757]/25 text-[#FF4757]'}`}
                >
                  {result.success
                    ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-[13px] font-bold">{result.message}</p>
                    {result.warning && <p className="text-[11px] text-[#F39C12] mt-1 font-semibold">{result.warning}</p>}
                    {result.member && <p className="text-[11px] opacity-70 mt-0.5">CI: {result.member.ci_number || '-'}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {}
          <div className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-4">
            <p className="text-[11px] text-[#D7DCE8]/40 font-semibold uppercase tracking-wider mb-2">💡 Instrucciones</p>
            <ul className="text-[12px] text-[#D7DCE8]/60 space-y-1.5">
              <li>• Ingresa el <strong className="text-[#F8FAFC]">Carnet de Identidad</strong> del miembro</li>
              <li>• O ingresa su <strong className="text-[#F8FAFC]">nombre completo</strong> para buscarlo</li>
              <li>• El sistema valida su membresía automáticamente</li>
              <li>• Solo se puede registrar una entrada por día</li>
            </ul>
          </div>
        </div>

        {}
        <div className="lg:col-span-3 bg-[#0A0C14] border border-[#1E2330] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1E2330]">
            <h2 className="text-[15px] font-bold text-[#F8FAFC]">Registro del Día</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-[12px] bg-[#12151D] border border-[#1E2330] rounded-xl px-3 py-2 text-[#D7DCE8] focus:outline-none focus:border-[#6D5DF6]/50"
            />
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            {loadingList ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 text-[#6D5DF6] animate-spin" />
              </div>
            ) : attendances.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-[#D7DCE8]/30">
                <ScanLine className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No hay entradas registradas para esta fecha</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#12151D]/50">
                    <th className="px-5 py-3 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider">Miembro</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider text-right">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2330]/50">
                  {attendances.map((a, i) => (
                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-[#12151D]/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#6D5DF6]/15 border border-[#6D5DF6]/30 flex items-center justify-center text-[#6D5DF6] text-[12px] font-black flex-shrink-0">
                            {a.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#F8FAFC]">{a.user?.name}</p>
                            <p className="text-[11px] text-[#D7DCE8]/40">CI: {a.user?.ci_number || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-[#2ECC71]">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[13px] font-bold">
                            {new Date(a.check_in_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
