import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, TrendingUp, Users, DollarSign, Clock, CheckCircle2,
  AlertTriangle, BarChart3, Bell, Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import StatsCard from '../components/ui/StatsCard';
import PackageTable from '../components/dashboard/PackageTable';
import { StatusBadge } from '../components/ui/Badge';
import { DEPARTAMENTOS } from '../data/departamentos';

const PIE_COLORS = ['#3b82f6','#10b981','#f59e0b','#6b7280','#ef4444'];

function Overview({ stats, loading }) {
  const chartData = [
    { name: 'En tránsito', value: stats?.en_transito || 0, fill: '#3b82f6' },
    { name: 'Entregados',  value: stats?.entregados  || 0, fill: '#10b981' },
    { name: 'Retrasados',  value: stats?.retrasados  || 0, fill: '#f59e0b' },
    { name: 'Pendientes',  value: stats?.pendientes  || 0, fill: '#6b7280' },
    { name: 'Cancelados',  value: stats?.cancelados  || 0, fill: '#ef4444' }
  ];

  const weeklyData = stats?.semanales?.map(d => ({
    dia: format(new Date(d.dia), 'EEE', { locale: es }),
    paquetes: parseInt(d.count)
  })) || [];

  const formatDate = (d) => {
    try { return format(new Date(d), 'd MMM, HH:mm', { locale: es }); }
    catch { return '—'; }
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard loading={loading} title="Total paquetes"  value={stats?.total_paquetes} icon={Package}      color="primary" />
        <StatsCard loading={loading} title="En tránsito"     value={stats?.en_transito}    icon={TrendingUp}   color="blue"    />
        <StatsCard loading={loading} title="Entregados"      value={stats?.entregados}     icon={CheckCircle2} color="emerald" />
        <StatsCard loading={loading} title="Retrasados"      value={stats?.retrasados}     icon={AlertTriangle} color="amber"  />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard loading={loading} title="Clientes"        value={stats?.total_clientes} icon={Users}      color="purple" />
        <StatsCard loading={loading} title="Tasa de éxito"   value={`${stats?.tasa_exito ?? 0}%`} icon={BarChart3} color="emerald" sub="Paquetes entregados" />
        <StatsCard loading={loading} title="Ingresos"        value={stats?.ingresos ? `Q${parseFloat(stats.ingresos).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` : 'Q0.00'} icon={DollarSign} color="secondary" sub="De entregas confirmadas" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Bar chart */}
        <div className="lg:col-span-3 card">
          <h3 className="font-semibold text-white mb-4">Paquetes — últimos 7 días</h3>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="dia" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#13131a', border: '1px solid #1e1e2e', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'rgba(232,0,45,0.05)' }}
                />
                <Bar dataKey="paquetes" fill="#e8002d" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">Sin datos para mostrar</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-white mb-4">Por estado</h3>
          {stats?.total_paquetes > 0 ? (
            <div className="flex flex-col items-center gap-3">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={chartData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {chartData.filter(d => d.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#13131a', border: '1px solid #1e1e2e', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-1.5">
                {chartData.filter(d => d.value > 0).map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.fill }} />
                      <span className="text-gray-400">{d.name}</span>
                    </div>
                    <span className="text-white font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-gray-500">Sin datos</div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <h3 className="font-semibold text-white mb-4">Actividad reciente</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 shimmer rounded-lg" />)}
          </div>
        ) : stats?.recientes?.length > 0 ? (
          <div className="space-y-2">
            {stats.recientes.map(pkg => (
              <div key={pkg.guia} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-hover transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{pkg.guia}</span>
                    <StatusBadge estado={pkg.estado} />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{pkg.cliente_nombre} → {pkg.destino_departamento}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(pkg.created_at)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">No hay actividad reciente</p>
        )}
      </div>
    </div>
  );
}

function CoverageTab() {
  const [filter, setFilter] = useState('');
  const filtered = DEPARTAMENTOS.filter(d => !filter || d.tipo === filter);

  const tipoColors = { mismo: 'badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', '24': 'badge bg-blue-500/20 text-blue-400 border border-blue-500/30', '48': 'badge bg-amber-500/20 text-amber-400 border border-amber-500/30', '72': 'badge bg-purple-500/20 text-purple-400 border border-purple-500/30' };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[['','Todos'],['mismo','Mismo día'],['24','24 horas'],['48','48 horas'],['72','72 horas']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${filter === v ? 'bg-primary border-primary text-white' : 'border-dark-border text-gray-400 hover:border-primary/40 hover:text-white'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(d => (
          <div key={d.nombre} className="card hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">{d.nombre}</h4>
              <span className={tipoColors[d.tipo]}>{d.label}</span>
            </div>
            <p className="text-xs text-gray-500">{d.municipios.length} municipios</p>
            <div className="mt-2 flex flex-wrap gap-1 max-h-20 overflow-hidden">
              {d.municipios.slice(0, 6).map(m => (
                <span key={m} className="text-xs px-2 py-0.5 bg-dark-hover rounded text-gray-400">{m}</span>
              ))}
              {d.municipios.length > 6 && <span className="text-xs text-gray-500 py-0.5">+{d.municipios.length - 6} más</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuotesTab() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quotes')
      .then(r => setQuotes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    try { return format(new Date(d), 'd MMM yyyy, HH:mm', { locale: es }); }
    catch { return '—'; }
  };

  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-4">Historial de cotizaciones</h3>
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 shimmer rounded" />)}</div>
      ) : quotes.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No hay cotizaciones guardadas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border text-left">
                {['Destino','Tipo','Peso','Cant.','Total','Fecha'].map(h => (
                  <th key={h} className="pb-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {quotes.map(q => (
                <tr key={q.id} className="hover:bg-dark-hover/50 transition-colors">
                  <td className="py-3 text-gray-300">{q.destino_departamento || (q.destino_tipo === 'capital' ? 'Capital' : 'Exterior')}{q.destino_municipio ? `, ${q.destino_municipio}` : ''}</td>
                  <td className="py-3"><span className={`badge ${q.tipo_envio === 'express' ? 'bg-secondary/20 text-secondary border-secondary/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'} border`}>{q.tipo_envio}</span></td>
                  <td className="py-3 text-gray-400">{q.peso_lbs} lbs</td>
                  <td className="py-3 text-gray-400">{q.cantidad}</td>
                  <td className="py-3 font-semibold text-white">Q{parseFloat(q.total).toFixed(2)}</td>
                  <td className="py-3 text-gray-500 text-xs">{formatDate(q.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <h3 className="font-semibold text-white mb-4">Gestión de usuarios</h3>
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 shimmer rounded" />)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                {['Usuario','Email','Rol','Estado','Creado'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-dark-hover/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                        {u.nombre[0]}
                      </div>
                      <span className="text-white font-medium">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-400">{u.email}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      u.rol === 'admin' ? 'bg-primary/20 text-primary border-primary/30' :
                      u.rol === 'operador' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    } border`}>{u.rol}</span>
                  </td>
                  <td className="py-3">
                    <span className={`badge ${u.activo ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} border`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">
                    {format(new Date(u.created_at), 'd MMM yyyy', { locale: es })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats]         = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    api.get('/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const tabs = {
    overview:  <Overview stats={stats} loading={statsLoading} />,
    packages:  <PackageTable />,
    quotes:    <QuotesTab />,
    coverage:  <CoverageTab />,
    users:     <UsersTab />
  };

  const tabTitles = {
    overview: 'Resumen general',
    packages: 'Gestión de paquetes',
    quotes:   'Cotizaciones',
    coverage: 'Cobertura departamental',
    users:    'Gestión de usuarios'
  };

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 ml-64 overflow-y-auto bg-dark/50">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-dark-card/80 backdrop-blur-sm border-b border-dark-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">{tabTitles[activeTab]}</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-hover transition-colors">
              <Bell size={18} />
            </button>
            <div className="h-5 w-px bg-dark-border" />
            <div className="text-xs text-gray-500">
              {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tabs[activeTab]}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
