import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Search, Package, Zap, MapPin, Clock, Shield, Star, Phone, Mail,
  ChevronDown, ChevronRight, ArrowRight, Truck, CheckCircle2, BarChart3,
  Globe, MessageSquare, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { DEPARTAMENTOS } from '../data/departamentos';

/* ── Animated counter ────────────────────────────────────────── */
function Counter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Features list ───────────────────────────────────────────── */
const FEATURES = [
  { icon: Package,    title: 'Rastreo en tiempo real',    desc: 'Sigue tu paquete paso a paso con actualizaciones instantáneas de estado.' },
  { icon: Zap,        title: 'Entrega Express',           desc: 'Servicio de entrega en 2 horas para Guatemala y áreas metropolitanas.' },
  { icon: Globe,      title: 'Cobertura nacional',        desc: 'Los 22 departamentos de Guatemala cubiertos con tiempos de entrega definidos.' },
  { icon: Shield,     title: 'Envíos garantizados',       desc: 'Compensación de hasta Q300 por paquetes perdidos o dañados.' },
  { icon: BarChart3,  title: 'Estadísticas en tiempo real', desc: 'Dashboard completo para monitorear tus envíos y optimizar tu logística.' },
  { icon: Clock,      title: 'Mismo día disponible',      desc: 'Entrega el mismo día en Guatemala Capital y Sacatepéquez.' }
];

/* ── How it works steps ──────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Registra tu paquete',   desc: 'Ingresa los datos del destinatario y el contenido en el panel de control.' },
  { n: '02', title: 'Nosotros lo recogemos', desc: 'Un operador de Speed Cargo recoge el paquete en la dirección indicada.' },
  { n: '03', title: 'Rastreo en tiempo real', desc: 'Monitorea el estado de tu envío con actualizaciones en cada etapa.' },
  { n: '04', title: 'Entrega confirmada',    desc: 'El paquete llega a su destino y recibes la confirmación de entrega.' }
];

/* ── Calculator ──────────────────────────────────────────────── */
function Calculator() {
  const [form, setForm] = useState({ destino: 'exterior', tipo: 'normal', peso: 1, cantidad: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const calcular = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quotes/calculate', { params: { destino_tipo: form.destino, tipo: form.tipo, peso_lbs: form.peso, cantidad: form.cantidad } });
      setResult(res.data.total);
    } catch {
      const base = form.destino === 'capital' ? 25 : 30;
      const express = form.tipo === 'express' ? 30 : 0;
      const extraPeso = Math.max(0, form.peso - 3) * 5;
      const extraCant = Math.max(0, form.cantidad - 3) * 15;
      setResult(base + express + extraPeso + extraCant);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Calcula tu tarifa</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Destino</label>
            <div className="flex gap-2">
              {[['capital','Capital'],['exterior','Interior']].map(([v,l]) => (
                <button key={v} onClick={() => set('destino')(v)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.destino === v ? 'border-primary bg-primary/10 text-primary' : 'border-dark-border text-gray-400 hover:border-primary/40'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Tipo de envío</label>
            <div className="flex gap-2">
              {[['normal','Normal'],['express','Express']].map(([v,l]) => (
                <button key={v} onClick={() => set('tipo')(v)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.tipo === v ? 'border-primary bg-primary/10 text-primary' : 'border-dark-border text-gray-400 hover:border-primary/40'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Peso (lbs)</label>
            <div className="flex items-center gap-2">
              <button onClick={() => set('peso')(Math.max(0.5, form.peso - 0.5))} className="w-9 h-9 rounded-lg bg-dark-hover border border-dark-border text-white flex items-center justify-center hover:border-primary/40 transition-colors font-bold">−</button>
              <span className="flex-1 text-center text-white font-semibold">{form.peso}</span>
              <button onClick={() => set('peso')(form.peso + 0.5)} className="w-9 h-9 rounded-lg bg-dark-hover border border-dark-border text-white flex items-center justify-center hover:border-primary/40 transition-colors font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Cantidad</label>
            <div className="flex items-center gap-2">
              <button onClick={() => set('cantidad')(Math.max(1, form.cantidad - 1))} className="w-9 h-9 rounded-lg bg-dark-hover border border-dark-border text-white flex items-center justify-center hover:border-primary/40 transition-colors font-bold">−</button>
              <span className="flex-1 text-center text-white font-semibold">{form.cantidad}</span>
              <button onClick={() => set('cantidad')(form.cantidad + 1)} className="w-9 h-9 rounded-lg bg-dark-hover border border-dark-border text-white flex items-center justify-center hover:border-primary/40 transition-colors font-bold">+</button>
            </div>
          </div>
        </div>
        <button onClick={calcular} disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
          Calcular tarifa
        </button>
        <AnimatePresence>
          {result !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-gray-400 text-sm mb-1">Costo estimado de envío</p>
              <p className="text-4xl font-bold text-primary">Q{result.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">*Precio final puede variar</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Coverage section ────────────────────────────────────────── */
function Coverage() {
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const filtered = DEPARTAMENTOS.filter(d => !filter || d.tipo === filter);

  const tipoConfig = {
    mismo: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    '24':  { color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20'    },
    '48':  { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
    '72':  { color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20'  }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {[['','Todos',''],[' mismo','Mismo día','bg-emerald-500'],['24','24 horas','bg-blue-500'],['48','48 horas','bg-amber-500'],['72','72 horas','bg-purple-500']].map(([v,l,c]) => (
          <button key={v} onClick={() => setFilter(v.trim())}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filter === v.trim() ? 'bg-primary border-primary text-white' : 'border-dark-border text-gray-400 hover:border-primary/40 hover:text-white bg-dark-card'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((d, i) => {
          const cfg = tipoConfig[d.tipo];
          const isOpen = expanded === d.nombre;
          return (
            <motion.div key={d.nombre}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`card border ${cfg.border} cursor-pointer hover:-translate-y-0.5 transition-all duration-200`}
              onClick={() => setExpanded(isOpen ? null : d.nombre)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{d.nombre}</h4>
                  <span className={`text-xs font-medium ${cfg.color}`}>{d.label} · {d.municipios.length} municipios</span>
                </div>
                <div className={`flex items-center gap-2 ${cfg.color}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg.replace('10','60')}`} />
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-dark-border flex flex-wrap gap-1">
                      {d.municipios.map(m => (
                        <span key={m} className="text-xs px-2 py-0.5 bg-dark-hover rounded text-gray-400">{m}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Home page ──────────────────────────────────────────── */
export default function Home() {
  const [trackGuia, setTrackGuia] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async () => {
    if (!trackGuia.trim()) { toast.error('Ingresa un número de guía'); return; }
    setTrackLoading(true);
    setTimeout(() => {
      navigate(`/rastrear?guia=${trackGuia.trim().toUpperCase()}`);
      setTrackLoading(false);
    }, 400);
  };

  const [contactForm, setContactForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [contactSent, setContactSent] = useState(false);
  const handleContact = (e) => {
    e.preventDefault();
    setContactSent(true);
    toast.success('¡Mensaje enviado! Te contactaremos pronto.');
    setContactForm({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="bg-dark">
      <Header />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-primary/5" />
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" />

        {/* Floating delivery icons */}
        <div className="absolute top-1/3 right-10 opacity-10 hidden xl:block">
          <motion.div animate={{ y: [0,-20,0] }} transition={{ duration: 6, repeat: Infinity, ease:'easeInOut' }}>
            <Package size={80} className="text-primary" />
          </motion.div>
        </div>
        <div className="absolute bottom-1/3 left-10 opacity-10 hidden xl:block">
          <motion.div animate={{ y: [0,20,0] }} transition={{ duration: 5, repeat: Infinity, ease:'easeInOut', delay: 1 }}>
            <Truck size={60} className="text-secondary" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap size={14} className="animate-pulse" />
              Paquetería nacional · 22 departamentos
            </span>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 leading-none tracking-tight">
              ENTREGA{' '}
              <span className="gradient-text">RÁPIDA</span>
              <br />
              CONFIANZA{' '}
              <span className="text-white">REAL</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              La empresa de paquetería más confiable de Guatemala.
              Rastreo en tiempo real, tarifas transparentes y entrega garantizada.
            </p>

            {/* Track bar */}
            <div className="flex gap-3 max-w-xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={trackGuia}
                  onChange={e => setTrackGuia(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTrack()}
                  placeholder="Número de guía — ej: SC10006789"
                  className="input-field pl-12 text-base font-mono h-14"
                />
              </div>
              <button onClick={handleTrack} disabled={trackLoading} className="btn-primary h-14 px-6 shrink-0">
                {trackLoading ? <Loader2 size={18} className="animate-spin" /> : 'Rastrear'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login?tab=register" className="btn-primary text-base py-3.5 px-8">
                Comenzar gratis <ArrowRight size={18} />
              </Link>
              <button onClick={() => document.querySelector('#cobertura')?.scrollIntoView({ behavior:'smooth' })}
                className="btn-outline text-base py-3.5 px-8">
                Ver cobertura
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronDown size={24} className="text-gray-400" />
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="bg-primary/5 border-y border-primary/10 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 5000, suffix:'+', label:'Paquetes entregados' },
              { value: 22, suffix:'', label:'Departamentos cubiertos' },
              { value: 99, suffix:'%', label:'Tasa de satisfacción' },
              { value: 2, suffix:'h', label:'Mínimo tiempo entrega' }
            ].map(s => (
              <motion.div key={s.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <Counter end={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="servicios" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">¿Por qué elegirnos?</p>
            <h2 className="section-title">Servicios diseñados<br />para tu negocio</h2>
            <p className="section-subtitle mx-auto text-center mt-3">
              Soluciones de logística completas para empresas y particulares en toda Guatemala.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-dark-card border-y border-dark-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Proceso simple</p>
            <h2 className="section-title">¿Cómo funciona?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative">
            <div className="hidden xl:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {STEPS.map((s, i) => (
              <motion.div key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white font-display text-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  {s.n}
                </div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVERAGE ─────────────────────────────────────────────── */}
      <section id="cobertura" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Red logística</p>
            <h2 className="section-title">Cobertura nacional</h2>
            <p className="section-subtitle mx-auto text-center">
              Entregamos en los 22 departamentos de Guatemala con tiempos de entrega definidos.
            </p>
          </div>
          <Coverage />
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────────── */}
      <section id="tarifas" className="py-20 px-4 bg-dark-card border-y border-dark-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Transparencia total</p>
            <h2 className="section-title">Calcula el costo de tu envío</h2>
            <p className="section-subtitle mx-auto text-center">Sin sorpresas. Precios fijos y claros.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Tarifas base</h3>
              <div className="space-y-3">
                {[
                  { label: 'Envío Capital (Guatemala/Sacatepéquez)', valor: 'Q25',  tipo: null },
                  { label: 'Envío Interior (demás departamentos)',   valor: 'Q30',  tipo: null },
                  { label: 'Servicio Express (2 horas)',             valor: '+Q30', tipo: 'express' },
                  { label: 'Peso adicional (sobre 3 lbs, por lb)',   valor: '+Q5',  tipo: null },
                  { label: 'Paquete adicional (sobre 3 unidades)',   valor: '+Q15', tipo: null }
                ].map(t => (
                  <div key={t.label} className="flex items-center justify-between p-3.5 rounded-xl bg-dark-hover border border-dark-border">
                    <span className="text-sm text-gray-300">{t.label}</span>
                    <span className={`font-bold ${t.tipo === 'express' ? 'text-secondary' : 'text-primary'}`}>{t.valor}</span>
                  </div>
                ))}
              </div>
            </div>
            <Calculator />
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ───────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Nuestro compromiso</p>
            <h2 className="section-title">Garantías de entrega</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '📦', title: 'Rastreo completo',         desc: 'Actualización de estado en cada punto del trayecto.' },
              { icon: '✍️',  title: 'Firma de recepción',      desc: 'Confirmación de entrega con firma o código del destinatario.' },
              { icon: '⏱️',  title: 'Tiempos de entrega',      desc: 'Cumplimos los tiempos prometidos según el departamento.' },
              { icon: '📞',  title: 'Notificación de incidentes', desc: 'Informamos inmediatamente cualquier inconveniente.' },
              { icon: '🛡️',  title: 'Manejo cuidadoso',        desc: 'Tratamos cada paquete con el máximo cuidado y respeto.' },
              { icon: '💰',  title: 'Compensación Q300',       desc: 'Indemnización de hasta Q300 por paquetes extraviados.' }
            ].map((g, i) => (
              <motion.div key={g.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover text-center"
              >
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="font-semibold text-white mb-2">{g.title}</h3>
                <p className="text-gray-400 text-sm">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-r from-primary to-primary-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute -top-20 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para enviar?</h2>
          <p className="text-white/80 text-lg mb-8">Únete a miles de clientes que confían en Speed Cargo para sus envíos.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login?tab=register" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors">
              Crear cuenta gratis
            </Link>
            <Link to="/rastrear" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Rastrear paquete
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      <section id="contacto" className="py-20 px-4 bg-dark-card border-t border-dark-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Atención al cliente</p>
            <h2 className="section-title">¿Tienes preguntas?</h2>
            <p className="section-subtitle mx-auto text-center">Estamos disponibles de lunes a sábado, 8am - 6pm.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-5">
              {[
                { icon: Phone, title: 'Teléfono', value: '+502 2222-3333', desc: 'Llámanos directamente' },
                { icon: Mail,  title: 'Email',    value: 'info@speedcargo.gt', desc: 'Respuesta en menos de 24h' },
                { icon: MapPin, title: 'Oficina', value: '6a Av. 12-36, Zona 10, Guatemala', desc: 'Visítanos presencialmente' }
              ].map(c => (
                <div key={c.title} className="flex gap-4 p-4 rounded-xl bg-dark-hover border border-dark-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <c.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{c.title}</h4>
                    <p className="text-primary text-sm font-medium">{c.value}</p>
                    <p className="text-gray-500 text-xs">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              {contactSent ? (
                <div className="text-center py-10">
                  <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-400">Te contactaremos en menos de 24 horas.</p>
                  <button onClick={() => setContactSent(false)} className="mt-4 text-sm text-primary hover:underline">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <h3 className="font-semibold text-white">Envíanos un mensaje</h3>
                  {[
                    { key: 'nombre', label: 'Tu nombre', type: 'text', placeholder: 'Nombre completo' },
                    { key: 'email',  label: 'Tu email',  type: 'email', placeholder: 'correo@ejemplo.com' }
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-gray-400 mb-1.5">{f.label}</label>
                      <input type={f.type} required value={contactForm[f.key]} onChange={e => setContactForm(c => ({...c,[f.key]:e.target.value}))} className="input-field text-sm" placeholder={f.placeholder} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Mensaje</label>
                    <textarea required rows={4} value={contactForm.mensaje} onChange={e => setContactForm(c => ({...c,mensaje:e.target.value}))} className="input-field text-sm resize-none" placeholder="¿En qué podemos ayudarte?" />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3">
                    <MessageSquare size={16} /> Enviar mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
