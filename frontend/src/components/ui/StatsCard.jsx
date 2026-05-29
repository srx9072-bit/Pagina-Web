import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, color = 'primary', sub, loading }) {
  const colors = {
    primary:  { bg: 'bg-primary/10',   text: 'text-primary',   border: 'border-primary/20'   },
    blue:     { bg: 'bg-blue-500/10',  text: 'text-blue-400',  border: 'border-blue-500/20'  },
    emerald:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber:    { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    purple:   { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' }
  };

  const c = colors[color] || colors.primary;

  if (loading) {
    return <div className="card shimmer h-28 rounded-2xl" />;
  }

  return (
    <motion.div
      className={`card border ${c.border} hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value ?? '—'}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${c.bg}`}>
            <Icon className={`${c.text}`} size={22} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
