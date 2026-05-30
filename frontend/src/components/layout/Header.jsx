import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Package, LayoutDashboard, LogOut, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Inicio',    to: '/',         hash: '#hero'      },
  { label: 'Rastrear',  to: '/rastrear', hash: null         },
  { label: 'Tarifas',   to: '/',         hash: '#tarifas'   },
  { label: 'Cobertura', to: '/',         hash: '#cobertura' },
  { label: 'Contacto',  to: '/',         hash: '#contacto'  }
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isOperator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = (link) => {
    setMenuOpen(false);
    if (link.hash && location.pathname === '/') {
      document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(link.to);
      if (link.hash) setTimeout(() => document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md shadow-card border-b border-dark-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logochejo.jpeg" alt="SpeedCargo" className="h-10 w-auto object-contain" />
            <span className="font-display text-2xl tracking-widest text-white">
              SPEED<span className="text-primary">CARGO</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => handleNav(link)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isOperator && (
                  <Link to="/dashboard" className="btn-ghost text-sm">
                    <LayoutDashboard size={16} />
                    Panel
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-hover border border-dark-border">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={12} className="text-primary" />
                  </div>
                  <span className="text-sm text-white font-medium max-w-[120px] truncate">{user.nombre}</span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300">
                  <LogOut size={16} />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2">
                  Iniciar sesión
                </Link>
                <Link to="/login?tab=register" className="btn-primary text-sm py-2">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-hover transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden border-t border-dark-border bg-dark/98 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link)}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-hover rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-dark-border mt-3 space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-400">Hola, <span className="text-white font-medium">{user.nombre}</span></div>
                    {isOperator && (
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-hover rounded-xl">
                        <LayoutDashboard size={16} /> Panel de control
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-dark-hover rounded-xl">
                      <LogOut size={16} /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-center text-gray-300 hover:text-white hover:bg-dark-hover rounded-xl">
                      Iniciar sesión
                    </Link>
                    <Link to="/login?tab=register" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-center bg-primary text-white font-semibold rounded-xl">
                      Crear cuenta gratis
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
