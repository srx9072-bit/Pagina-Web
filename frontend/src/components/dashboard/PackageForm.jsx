import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, User, DollarSign, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { DEPARTAMENTOS } from '../../data/departamentos';

const ESTADOS = [
  { value: 'pendiente',   label: 'Pendiente'   },
  { value: 'en_transito', label: 'En tránsito' },
  { value: 'entregado',   label: 'Entregado'   },
  { value: 'retrasado',   label: 'Retrasado'   },
  { value: 'cancelado',   label: 'Cancelado'   }
];

export default function PackageForm({ pkg, onSuccess, onCancel }) {
  const isEdit = Boolean(pkg);

  const [form, setForm] = useState({
    cliente_nombre: '', cliente_email: '', cliente_telefono: '',
    descripcion: '', peso_lbs: '1', cantidad: '1',
    origen_departamento: 'Guatemala', origen_municipio: 'Guatemala',
    destino_departamento: '', destino_municipio: '',
    direccion_entrega: '', tipo_envio: 'normal',
    costo_total: '', observaciones: '', estado: 'en_transito'
  });

  const [loading, setLoading] = useState(false);
  const [quote, setQuote]     = useState(null);

  useEffect(() => {
    if (pkg) {
      setForm({
        cliente_nombre:       pkg.cliente_nombre     || '',
        cliente_email:        pkg.cliente_email      || '',
        cliente_telefono:     pkg.cliente_telefono   || '',
        descripcion:          pkg.descripcion        || '',
        peso_lbs:             String(pkg.peso_lbs    || '1'),
        cantidad:             String(pkg.cantidad    || '1'),
        origen_departamento:  pkg.origen_departamento || 'Guatemala',
        origen_municipio:     pkg.origen_municipio   || 'Guatemala',
        destino_departamento: pkg.destino_departamento || '',
        destino_municipio:    pkg.destino_municipio  || '',
        direccion_entrega:    pkg.direccion_entrega  || '',
        tipo_envio:           pkg.tipo_envio         || 'normal',
        costo_total:          String(pkg.costo_total || ''),
        observaciones:        pkg.observaciones      || '',
        estado:               pkg.estado             || 'en_transito'
      });
    }
  }, [pkg]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!form.destino_departamento) return;
      try {
        const tipo = DEPARTAMENTOS.find(d => d.nombre === form.destino_departamento)?.tipo;
        const destTipo = (form.destino_departamento === 'Guatemala' || form.destino_departamento === 'Sacatepéquez') ? 'capital' : 'exterior';
        const res = await api.get('/quotes/calculate', {
          params: { destino: destTipo, tipo: form.tipo_envio, peso_lbs: form.peso_lbs, cantidad: form.cantidad }
        });
        setQuote(res.data.total);
        if (!form.costo_total) setForm(f => ({ ...f, costo_total: String(res.data.total) }));
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [form.destino_departamento, form.tipo_envio, form.peso_lbs, form.cantidad]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/packages/${pkg.id}`, {
          estado: form.estado,
          observaciones: form.observaciones
        });
        toast.success('Paquete actualizado');
      } else {
        await api.post('/packages', {
          ...form,
          peso_lbs: parseFloat(form.peso_lbs),
          cantidad: parseInt(form.cantidad),
          costo_total: parseFloat(form.costo_total) || null
        });
        toast.success('Paquete registrado exitosamente');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const destDeptoMunis = DEPARTAMENTOS.find(d => d.nombre === form.destino_departamento)?.municipios || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isEdit && (
        <>
          {/* Cliente */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <User size={14} className="text-primary" /> Datos del cliente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nombre *</label>
                <input required value={form.cliente_nombre} onChange={set('cliente_nombre')} className="input-field text-sm" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email</label>
                <input type="email" value={form.cliente_email} onChange={set('cliente_email')} className="input-field text-sm" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Teléfono</label>
                <input value={form.cliente_telefono} onChange={set('cliente_telefono')} className="input-field text-sm" placeholder="4455-6677" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Descripción del contenido</label>
                <input value={form.descripcion} onChange={set('descripcion')} className="input-field text-sm" placeholder="Electrónica, ropa..." />
              </div>
            </div>
          </div>

          {/* Paquete */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Package size={14} className="text-primary" /> Detalles del paquete
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Peso (lbs)</label>
                <input type="number" min="0.1" step="0.1" value={form.peso_lbs} onChange={set('peso_lbs')} className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Cantidad</label>
                <input type="number" min="1" value={form.cantidad} onChange={set('cantidad')} className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tipo de envío</label>
                <select value={form.tipo_envio} onChange={set('tipo_envio')} className="input-field text-sm">
                  <option value="normal">Normal</option>
                  <option value="express">Express (+Q30)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Costo (Q){quote && <span className="text-primary ml-1">≈ Q{quote}</span>}
                </label>
                <input type="number" min="0" step="0.01" value={form.costo_total} onChange={set('costo_total')} className="input-field text-sm" placeholder="Auto" />
              </div>
            </div>
          </div>

          {/* Destino */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-primary" /> Destino
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Departamento destino *</label>
                <select required value={form.destino_departamento} onChange={e => setForm(f => ({ ...f, destino_departamento: e.target.value, destino_municipio: '' }))} className="input-field text-sm">
                  <option value="">Seleccionar...</option>
                  {DEPARTAMENTOS.map(d => <option key={d.nombre} value={d.nombre}>{d.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Municipio</label>
                <select value={form.destino_municipio} onChange={set('destino_municipio')} className="input-field text-sm" disabled={!destDeptoMunis.length}>
                  <option value="">Seleccionar...</option>
                  {destDeptoMunis.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Dirección de entrega *</label>
                <input required value={form.direccion_entrega} onChange={set('direccion_entrega')} className="input-field text-sm" placeholder="Calle, número, zona, referencia..." />
              </div>
            </div>
          </div>
        </>
      )}

      {/* En modo edición, solo estado y observaciones */}
      {isEdit && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Estado</label>
            <select value={form.estado} onChange={set('estado')} className="input-field">
              {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Observaciones</label>
            <textarea value={form.observaciones} onChange={set('observaciones')} rows={3} className="input-field resize-none" placeholder="Notas adicionales..." />
          </div>
        </div>
      )}

      {/* Observaciones (solo en nuevo) */}
      {!isEdit && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">Observaciones</label>
          <textarea value={form.observaciones} onChange={set('observaciones')} rows={2} className="input-field text-sm resize-none" placeholder="Instrucciones especiales, notas..." />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 btn-ghost border border-dark-border rounded-xl py-2.5">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-60">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar paquete'}
        </button>
      </div>
    </form>
  );
}
