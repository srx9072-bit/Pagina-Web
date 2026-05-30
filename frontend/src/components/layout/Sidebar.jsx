import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Calculator, MapPin, Users,
  LogOut, ChevronRight, Bell, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Resumen',       tab: 'overview',    always: true  },
  { icon: Package,         label: 'Paquetes',       tab: 'packages',    always: true  },
  { icon: Calculator,      label: 'Cotizaciones',   tab: 'quotes',      always: true  },
  { icon: MapPin,          label: 'Cobertura',      tab: 'coverage',    always: true  },
  { icon: Users,           label: 'Usuarios',       tab: 'users',       adminOnly: true }
];

export default function Sidebar({ activeTab, onTabChange }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.aside
      className="fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border flex flex-col z-20"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-dark-border">
        <div className="flex items-center gap-2.5">
          <img src="/logochejo.jpeg" alt="SpeedCargo" className="h-9 w-auto object-contain" />
          <span className="font-display text-xl tracking-widest text-white">
            SPEED<span className="text-primary">CARGO</span>
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-10">Panel de control</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">Menú</p>
        {navItems
          .filter(item => !item.adminOnly || isAdmin)
          .map(item => (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.tab
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              <item.icon size={18} className={activeTab === item.tab ? 'text-primary' : ''} />
              {item.label}
              {activeTab === item.tab && (
                <ChevronRight size={14} className="ml-auto text-primary" />
              )}
            </button>
          ))
        }
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-dark-border space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-hover">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.nombre?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.nombre}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </motion.aside>
  );
}
