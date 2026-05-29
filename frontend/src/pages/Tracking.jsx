import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Package, MapPin, Clock, CheckCircle2, AlertTriangle,
  XCircle, Loader2, ArrowRight, Truck, Star, Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const STATE_CONFIG = {
  pendiente:   { label: 'Pendiente',    icon: Clock,         color: 'text-gray-400',   bg: 'bg-gray-500/20',   border: 'border-gray-500/30'   },
  en_transito: { label: 'En tránsito',  icon: Truck,         color: 'text-blue-400',   bg: 'bg-blue-500/20',   border: 'border-blue-500/30'   },
  entregado:   { label: 'Entregado',    icon: CheckCircle2,  color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  retrasado:   { label: 'Retrasado',    icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/20',  border: 'border-amber-500/30'  },
  cancelado:   { label: 'Cancelado',    icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-500/20',    border: 'border-red-500/30'    }
};

const TIMELINE_STATES = ['pendiente', 'en_transito', 'entregado'];

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [guia, setGuia]       = useState(searchParams.get('guia') || '');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const initial = searchParams.get('guia');
    if (initial) handleSearch(initial);
  }, []);

  const handleSearch = async (g = guia) => {
    if (!g.trim()) { toast.error('Ingresa un número de guía'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/packages/track/${g.trim().toUpperCase()}`);
      setResult(res.data);
    } catch (err) {
      setResult(null);
      console.log(err.response)
      if (err.response?.status === 404) {
        toast.error('Paquete no encontrado. Verifica el número de guía.');
      } else {
        toast.error('Error al buscar el paquete');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return format(new Date(d), "d 'de' MMMM yyyy, HH:mm", { locale: es }); }
    catch { return '—'; }
  };

  const cfg = result ? STATE_CONFIG[result.estado] : null;
  const currentStateIdx = result ? TIMELINE_STATES.indexOf(result.estado) : -1;

  return (
    <div className="min-h-screen bg-dark">
      <Header />

      {/* Hero search */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-dark-card to-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Package size={14} /> Rastreo de paquetes
            </span>
            <h1 className="text-4xl font-bold text-white mb-3">¿Dónde está mi paquete?</h1>
            <p className="text-gray-400 mb-8">Ingresa el número de guía para ver el estado de tu envío en tiempo real</p>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={guia}
                  onChange={e => setGuia(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Ej: SC10006789"
                  className="input-field pl-12 text-base font-mono"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="btn-primary px-6 shrink-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['SC10006789','SC10001234','SC10011234'].map(g => (
                <button key={g} onClick={() => { setGuia(g); handleSearch(g); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-dark-hover border border-dark-border text-gray-400 hover:text-primary hover:border-primary/40 transition-colors font-mono">
                  {g}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-3xl mx-auto px-4 py-10 pb-20">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-20">
              <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <p className="text-gray-400">Buscando paquete...</p>
            </motion.div>
          )}

          {!loading && searched && !result && (
            <motion.div key="notfound" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Package size={28} className="text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Paquete no encontrado</h3>
              <p className="text-gray-400">Verifica que el número de guía sea correcto.</p>
            </motion.div>
          )}

          {!loading && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* Main card */}
              <div className={`card border ${cfg.border} relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${cfg.bg}`} />
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xl font-bold text-primary">{result.guia}</span>
                      <span className={`badge ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                        <cfg.icon size={12} /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{result.descripcion || 'Paquete sin descripción'}</p>
                  </div>
                  {result.tipo_envio === 'express' && (
                    <span className="badge bg-secondary/20 text-secondary border border-secondary/30">
                      <Star size={11} /> Express
                    </span>
                  )}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
                  {[
                    { label: 'Cliente',      value: result.cliente_nombre || '—' },
                    { label: 'Peso',         value: `${result.peso_lbs} lbs` },
                    { label: 'Cantidad',     value: `${result.cantidad} paquete(s)` },
                    { label: 'Origen',       value: `${result.origen_departamento}, ${result.origen_municipio}` },
                    { label: 'Destino',      value: `${result.destino_departamento}${result.destino_municipio ? `, ${result.destino_municipio}` : ''}` },
                    { label: 'Costo',        value: result.costo_total ? `Q ${parseFloat(result.costo_total).toFixed(2)}` : '—' },
                    { label: 'Registrado',   value: formatDate(result.created_at) },
                    { label: 'Est. entrega', value: result.fecha_estimada_entrega ? format(new Date(result.fecha_estimada_entrega), 'd MMM yyyy', { locale: es }) : '—' },
                    { label: 'Entregado',    value: result.fecha_entrega ? formatDate(result.fecha_entrega) : '—' }
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                      <p className="text-sm text-white font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                {result.direccion_entrega && (
                  <div className="mt-4 p-3 rounded-xl bg-dark-hover border border-dark-border flex items-start gap-2">
                    <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Dirección de entrega</p>
                      <p className="text-sm text-gray-300">{result.direccion_entrega}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress timeline */}
              {result.estado !== 'cancelado' && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-5">Progreso del envío</h3>
                  <div className="flex items-center gap-2">
                    {TIMELINE_STATES.map((st, i) => {
                      const s = STATE_CONFIG[st];
                      const done = i <= currentStateIdx;
                      return (
                        <div key={st} className="flex items-center flex-1">
                          <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                              done ? `${s.bg} ${s.border} ${s.color}` : 'border-dark-border bg-dark-hover text-gray-600'
                            }`}>
                              <s.icon size={16} />
                            </div>
                            <span className={`text-xs font-medium text-center ${done ? s.color : 'text-gray-600'}`}>{s.label}</span>
                          </div>
                          {i < TIMELINE_STATES.length - 1 && (
                            <div className={`h-0.5 w-8 mx-1 transition-colors ${i < currentStateIdx ? 'bg-primary' : 'bg-dark-border'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* History */}
              {result.historial?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-5">Historial de estados</h3>
                  <div className="space-y-4">
                    {result.historial.map((h, i) => {
                      const s = STATE_CONFIG[h.estado] || STATE_CONFIG.pendiente;
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.bg} ${s.color}`}>
                              <s.icon size={14} />
                            </div>
                            {i < result.historial.length - 1 && <div className="w-0.5 flex-1 bg-dark-border mt-2" />}
                          </div>
                          <div className="pb-4 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-sm font-medium ${s.color}`}>{s.label}</span>
                              <span className="text-xs text-gray-500">{formatDate(h.created_at)}</span>
                            </div>
                            {h.ubicacion && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><MapPin size={10} />{h.ubicacion}</p>}
                            {h.observacion && <p className="text-xs text-gray-500 mt-1">{h.observacion}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Support */}
              <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="font-semibold text-white">¿Necesitas ayuda?</h4>
                    <p className="text-gray-400 text-sm mt-1">Nuestro equipo está disponible de lunes a sábado, 8am - 6pm</p>
                  </div>
                  <a href="tel:+50222223333" className="btn-primary text-sm py-2.5">
                    <Phone size={15} /> Llamar ahora
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
}
