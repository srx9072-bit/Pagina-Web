const STATUS_MAP = {
  en_transito: { label: 'En tránsito',  cls: 'badge-transit'   },
  entregado:   { label: 'Entregado',    cls: 'badge-delivered' },
  retrasado:   { label: 'Retrasado',    cls: 'badge-delayed'   },
  pendiente:   { label: 'Pendiente',    cls: 'badge-pending'   },
  cancelado:   { label: 'Cancelado',    cls: 'badge-cancelled' }
};

const TIPO_MAP = {
  express: { label: 'Express', cls: 'badge bg-secondary/20 text-secondary border border-secondary/30' },
  normal:  { label: 'Normal',  cls: 'badge bg-gray-500/20 text-gray-400 border border-gray-500/30'   }
};

export function StatusBadge({ estado }) {
  const { label, cls } = STATUS_MAP[estado] || { label: estado, cls: 'badge-pending' };
  return <span className={cls}>{label}</span>;
}

export function TipoBadge({ tipo }) {
  const { label, cls } = TIPO_MAP[tipo] || TIPO_MAP.normal;
  return <span className={cls}>{label}</span>;
}
