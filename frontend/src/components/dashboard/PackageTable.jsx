import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, RefreshCw, Pencil, Trash2, Filter, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { StatusBadge, TipoBadge } from '../ui/Badge';
import Modal from '../ui/Modal';
import PackageForm from './PackageForm';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'en_transito', label: 'En tránsito' },
  { value: 'entregado',   label: 'Entregados'  },
  { value: 'retrasado',   label: 'Retrasados'  },
  { value: 'pendiente',   label: 'Pendientes'  },
  { value: 'cancelado',   label: 'Cancelados'  }
];

const STATUS_CYCLE = ['en_transito', 'entregado', 'retrasado', 'pendiente'];

export default function PackageTable() {
  const [packages, setPackages]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [estado, setEstado]       = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editPkg, setEditPkg]     = useState(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (estado) params.estado = estado;
      const res = await api.get('/packages', { params });
      setPackages(res.data.packages);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Error al cargar paquetes');
    } finally {
      setLoading(false);
    }
  }, [page, search, estado]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  useEffect(() => { setPage(1); }, [search, estado]);

  const handleDelete = async (pkg) => {
    if (!confirm(`¿Eliminar paquete ${pkg.guia}?`)) return;
    try {
      await api.delete(`/packages/${pkg.id}`);
      toast.success('Paquete eliminado');
      fetchPackages();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleStatusChange = async (pkg) => {
    const current = STATUS_CYCLE.indexOf(pkg.estado);
    const next = STATUS_CYCLE[(current + 1) % STATUS_CYCLE.length];
    try {
      await api.put(`/packages/${pkg.id}`, { estado: next });
      toast.success(`Estado actualizado a: ${next.replace('_', ' ')}`);
      fetchPackages();
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditPkg(null);
    fetchPackages();
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return format(new Date(d), 'd MMM yyyy', { locale: es }); }
    catch { return '—'; }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar guía, cliente, destino..."
              className="input-field pl-9 text-sm"
            />
          </div>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className="input-field w-40 text-sm"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchPackages} className="btn-ghost text-sm" title="Actualizar">
            <RefreshCw size={15} />
          </button>
          <button onClick={() => { setEditPkg(null); setShowForm(true); }} className="btn-primary text-sm py-2.5">
            <Plus size={16} /> Nuevo paquete
          </button>
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Package size={15} />
        <span>{total} paquete{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border text-left">
                {['Guía','Cliente','Destino','Tipo','Estado','Costo','Fecha','Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-dark-border/50">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 shimmer rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-gray-500">
                    <Package size={36} className="mx-auto mb-3 opacity-30" />
                    No se encontraron paquetes
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {packages.map(pkg => (
                    <motion.tr
                      key={pkg.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          {pkg.guia}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium truncate max-w-[130px]">{pkg.cliente_nombre || '—'}</p>
                          {pkg.cliente_email && <p className="text-xs text-gray-500 truncate max-w-[130px]">{pkg.cliente_email}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-300 truncate max-w-[140px]">{pkg.destino_departamento}</p>
                        {pkg.destino_municipio && <p className="text-xs text-gray-500">{pkg.destino_municipio}</p>}
                      </td>
                      <td className="px-4 py-3"><TipoBadge tipo={pkg.tipo_envio} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleStatusChange(pkg)} title="Click para cambiar estado">
                          <StatusBadge estado={pkg.estado} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        {pkg.costo_total ? `Q ${parseFloat(pkg.costo_total).toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(pkg.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditPkg(pkg); setShowForm(true); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-border">
            <span className="text-xs text-gray-500">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-hover transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-hover transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditPkg(null); }}
        title={editPkg ? `Editar paquete ${editPkg.guia}` : 'Registrar nuevo paquete'}
        size="lg"
      >
        <PackageForm pkg={editPkg} onSuccess={handleFormSuccess} onCancel={() => { setShowForm(false); setEditPkg(null); }} />
      </Modal>
    </div>
  );
}
