import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [params] = useSearchParams();
  const [tab, setTab]       = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [passStrength, setPassStrength] = useState(0);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(loginForm.email, loginForm.password);
      toast.success(`¡Bienvenido, ${u.nombre}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const u = await register(registerForm.nombre, registerForm.email, registerForm.password, registerForm.telefono);
      toast.success(`¡Cuenta creada! Bienvenido, ${u.nombre}`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-lime-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left — branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-dark via-dark-card to-primary/20 flex-col justify-between p-10 relative overflow-hidden">
        {/* BG pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <img src="/logochejo.jpeg" alt="SpeedCargo" className="h-12 w-auto object-contain" />
          <span className="font-display text-2xl tracking-widest text-white">
            SPEED<span className="text-primary">CARGO</span>
          </span>
        </Link>

        <div className="relative space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Tu paquete,<br />
            <span className="gradient-text">nuestra prioridad.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Gestiona tus envíos, rastrea en tiempo real y accede a estadísticas completas
            desde tu panel de control.
          </p>
          <div className="space-y-3">
            {[
              'Rastreo en tiempo real de tus paquetes',
              'Cobertura en los 22 departamentos',
              'Panel de gestión completo',
              'Historial y cotizaciones guardadas'
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-gray-600">© {new Date().getFullYear()} Speed Cargo. Guatemala.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={15} /> Volver al inicio
          </Link>

          {/* Tabs */}
          <div className="flex p-1 bg-dark-hover rounded-xl mb-8 border border-dark-border">
            {[['login','Iniciar sesión'],['register','Crear cuenta']].map(([t, l]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  tab === t ? 'bg-primary text-white shadow-glow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
                  <p className="text-gray-400 text-sm mt-1">Ingresa tus datos para continuar</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                    <input
                      type="email" required
                      value={loginForm.email}
                      onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      className="input-field"
                      placeholder="tu@correo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'} required
                        value={loginForm.password}
                        onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                        className="input-field pr-10"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-dark-hover border border-dark-border text-xs text-gray-500 space-y-1">
                  <p className="font-medium text-gray-400">Cuentas de prueba:</p>
                  <p>Admin: <span className="text-primary font-mono">admin@speedcargo.gt / Admin123!</span></p>
                  <p>Operador: <span className="text-primary font-mono">cmendez@speedcargo.gt / Admin123!</span></p>
                  <p>Cliente: <span className="text-primary font-mono">pedro@gmail.com / Cliente123!</span></p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={handleRegister}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white">Crear cuenta</h2>
                  <p className="text-gray-400 text-sm mt-1">Empieza a gestionar tus envíos hoy</p>
                </div>
                <div className="space-y-3 pt-2">
                  {[
                    { key: 'nombre', label: 'Nombre completo', type: 'text',  placeholder: 'Tu nombre' },
                    { key: 'email',  label: 'Email',           type: 'email', placeholder: 'tu@correo.com' },
                    { key: 'telefono', label: 'Teléfono (opcional)', type: 'tel', placeholder: '4455-6677' }
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                      <input
                        type={type} required={key !== 'telefono'}
                        value={registerForm[key]}
                        onChange={e => setRegisterForm(f => ({ ...f, [key]: e.target.value }))}
                        className="input-field"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'} required
                        value={registerForm.password}
                        onChange={e => {
                          setRegisterForm(f => ({ ...f, password: e.target.value }));
                          setPassStrength(getStrength(e.target.value));
                        }}
                        className="input-field pr-10"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {registerForm.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passStrength ? strengthColors[passStrength] : 'bg-dark-border'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{strengthLabels[passStrength]}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Al registrarte aceptas nuestros <a href="#" className="text-primary hover:underline">Términos de servicio</a>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
