import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ScanLine, DollarSign, ArrowUpRight, Activity, FileText, ChevronDown, MoreHorizontal, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/api';

const StatCard = ({ title, value, trend, icon: Icon, delay, chartData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-5 relative overflow-hidden group hover:border-[#6D5DF6]/40 transition-all flex flex-col h-[160px]"
  >
    {}
    <div className="flex justify-between items-start mb-2 relative z-10">
      <div className="p-3 bg-gradient-to-br from-[#1E2330]/80 to-[#12151D] rounded-2xl border border-[#1E2330]">
        <Icon className="w-5 h-5 text-[#6D5DF6]" />
      </div>
      <div>
        <h3 className="text-[12px] text-[#D7DCE8]/70 font-medium mb-1 text-right">{title}</h3>
        <p className="text-3xl font-bold text-[#F8FAFC] tracking-tight text-right">{value}</p>
      </div>
    </div>
    
    <div className="flex items-center gap-1 mt-auto relative z-10 w-max px-2 py-1 bg-[#10241A] text-[#2ECC71] rounded-full border border-[#2ECC71]/20 text-[10px] font-bold">
      <ArrowUpRight className="w-3 h-3" />
      {trend}
    </div>

    {}
    <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-50">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData || []}>
          <Line type="monotone" dataKey="v" stroke="#6D5DF6" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { selectedBranch } = useOutletContext();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('synx_user') || '{}');
  const isOwner = user?.role === 'owner';
  
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); 
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [data, setData] = useState({
    stats: {
      ingresos_mes: 0,
      miembros_activos: 0,
      nuevas_suscripciones: 0,
      asistencias_hoy: 0,
    },
    flujo_semanal: [],
    ingresos_recientes: [],
    asistencias_recientes: [],
    miembros_historial: [],
    sparklines: {
      ingresos: [], activos: [], nuevos: [], asistencias: []
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = { period };
        if (selectedBranch) params.branch_id = selectedBranch.id;
        const response = await api.get('/admin/dashboard', { params });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBranch, period]);

  const periodLabels = {
    day: 'Últimas 24 Hrs',
    week: 'Esta Semana',
    month: 'Últimos 30 Días',
    year: 'Último Año'
  };

  if (loading && !data.flujo_semanal.length) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#6D5DF6] animate-spin mb-4" />
        <p className="text-[#D7DCE8]/50 text-sm">Cargando métricas de AESGYM...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      
      {}
      <div className="flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[28px] font-bold text-[#F8FAFC] mb-1 tracking-tight"
          >
            Panel de Control
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-[#D7DCE8]/60"
          >
            Resumen en tiempo real de la actividad del gimnasio.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#0A0C14] border border-[#1E2330] rounded-xl text-[#D7DCE8] text-[13px] font-medium"
        >
          <Activity className="w-4 h-4 text-[#6D5DF6]" />
          Sistema Operativo
        </motion.div>
      </div>

      {}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isOwner ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6`}>
        {isOwner && (
          <>
            <StatCard 
              title="Ingresos del Mes" 
              value={`Bs ${data.stats.ingresos_mes}`} 
              trend="Actual" 
              icon={DollarSign} 
              delay={0.1} 
              chartData={data.sparklines?.ingresos}
            />
            <StatCard 
              title="Suscripciones (30d)" 
              value={data.stats.nuevas_suscripciones} 
              trend="Nuevas Altas" 
              icon={FileText} 
              delay={0.3} 
              chartData={data.sparklines?.nuevos}
            />
          </>
        )}
        <StatCard 
          title="Miembros Activos" 
          value={data.stats.miembros_activos} 
          trend="Plan Vigente" 
          icon={Users} 
          delay={0.2} 
          chartData={data.sparklines?.activos}
        />
        <StatCard 
          title="Asistencias Hoy" 
          value={data.stats.asistencias_hoy} 
          trend="Entradas Diarias" 
          icon={ScanLine} 
          delay={0.4} 
          chartData={data.sparklines?.asistencias}
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-6 h-[300px] flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6 z-10 relative">
              <h3 className="text-[15px] font-bold text-[#F8FAFC]">Evolución de Miembros Activos</h3>
              <div className="px-3 py-1 bg-[#12151D] border border-[#1E2330] rounded-lg text-[11px] text-[#2ECC71]">
                Últimos 6 meses
              </div>
            </div>
            
            <div className="flex-1 w-full h-full relative z-10">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C14]/50 z-20">
                  <Loader2 className="w-6 h-6 text-[#6D5DF6] animate-spin" />
                </div>
              ) : null}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.miembros_historial || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#D7DCE8" opacity={0.5} tick={{ fill: '#D7DCE8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#D7DCE8" opacity={0.5} tick={{ fill: '#D7DCE8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#1E2330', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#12151D', border: '1px solid #1E2330', borderRadius: '12px', color: '#F8FAFC' }}
                    itemStyle={{ color: '#2ECC71' }}
                  />
                  <Line type="monotone" dataKey="activos" stroke="#2ECC71" strokeWidth={3} dot={{ fill: '#2ECC71', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-6 h-[300px] flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6 z-50 relative">
              <h3 className="text-[15px] font-bold text-[#F8FAFC]">Flujo de Asistencia</h3>
              <div className="flex items-center gap-3 relative">
                <button 
                  onClick={() => setShowPeriodMenu(!showPeriodMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#12151D] border border-[#1E2330] rounded-lg text-[12px] text-[#D7DCE8]/70 hover:text-white transition-colors"
                >
                  {periodLabels[period]} <ChevronDown className="w-3 h-3" />
                </button>
                {showPeriodMenu && (
                  <div className="absolute top-10 right-0 w-32 bg-[#12151D] border border-[#1E2330] rounded-xl shadow-2xl overflow-hidden z-50">
                    {Object.entries(periodLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => { setPeriod(key); setShowPeriodMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-[12px] hover:bg-[#1E2330] transition-colors ${period === key ? 'text-[#6D5DF6] font-bold bg-[#6D5DF6]/10' : 'text-[#D7DCE8]'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 w-full h-full relative z-10">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C14]/50 z-20">
                  <Loader2 className="w-6 h-6 text-[#6D5DF6] animate-spin" />
                </div>
              ) : null}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.flujo_semanal || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#D7DCE8" opacity={0.5} tick={{ fill: '#D7DCE8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#D7DCE8" opacity={0.5} tick={{ fill: '#D7DCE8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#1E2330', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#12151D', border: '1px solid #1E2330', borderRadius: '12px', color: '#F8FAFC' }}
                    itemStyle={{ color: '#6D5DF6' }}
                  />
                  <Bar dataKey="ingresos" fill="#6D5DF6" radius={[4, 4, 4, 4]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl p-6 relative overflow-hidden flex flex-col lg:max-h-[624px]"
        >
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2ECC71] opacity-30"></div>

          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h3 className="text-[15px] font-bold text-[#F8FAFC]">{isOwner ? 'Pagos Recientes' : 'Ingresos Recientes'}</h3>
            <button 
              onClick={() => navigate(isOwner ? '/admin/subscriptions' : '/admin/attendance')}
              className="px-3 py-1 bg-[#12151D] border border-[#1E2330] rounded-lg text-[11px] text-[#D7DCE8]/70 hover:text-white transition-colors"
            >
              Historial
            </button>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {(isOwner ? data.ingresos_recientes : data.asistencias_recientes)?.length === 0 ? (
              <p className="text-sm text-[#D7DCE8]/50 text-center py-10">No hay registros recientes</p>
            ) : (
              (isOwner ? data.ingresos_recientes : data.asistencias_recientes)?.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#040508]/50 border border-[#1E2330]/50 hover:border-[#1E2330] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#12151D] flex items-center justify-center text-[13px] font-bold text-[#F8FAFC] border border-[#1E2330] flex-shrink-0">
                      {activity.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#F8FAFC] truncate max-w-[100px] sm:max-w-[140px]">{activity.name}</p>
                      <p className="text-[11px] text-[#D7DCE8]/50 truncate max-w-[100px] sm:max-w-[140px]">{activity.plan}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className={`px-2 py-0.5 rounded text-[11px] font-bold border ${isOwner ? 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20' : 'bg-[#6D5DF6]/10 text-[#6D5DF6] border-[#6D5DF6]/20'}`}>
                      {activity.status}
                    </div>
                    <p className="text-[10px] text-[#D7DCE8]/40">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {}
      {isOwner && !selectedBranch && data?.branches_performance && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="bg-[#0A0C14] border border-[#1E2330] rounded-2xl overflow-hidden mt-6"
        >
          <div className="p-5 border-b border-[#1E2330]">
            <h3 className="text-[15px] font-bold text-[#F8FAFC]">Rendimiento por Sucursal</h3>
            <p className="text-[12px] text-[#D7DCE8]/50 mt-0.5">Comparativa de ingresos y miembros activos</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#12151D]/50 border-b border-[#1E2330]">
                  <th className="px-5 py-3 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider">Sucursal</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider text-right">Miembros Activos</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider text-right">Ingresos (Mes)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2330]/50">
                {data.branches_performance.map((branch, i) => (
                  <motion.tr 
                    key={branch.id} 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="hover:bg-[#12151D]/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-[14px] font-bold text-[#F8FAFC]">{branch.name}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2.5 py-1 rounded-lg text-[#2ECC71]">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[13px] font-bold">{branch.members}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 px-2.5 py-1 rounded-lg text-[#6D5DF6]">
                        <span className="text-[13px] font-bold whitespace-nowrap">
                          {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(branch.revenue)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default AdminDashboard;
