import { Link } from 'react-router-dom';
import { Zap, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-glow">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-display text-2xl tracking-widest text-white">
                SPEED<span className="text-primary">CARGO</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empresa de paquetería líder en Guatemala con cobertura en los 22 departamentos.
              Entrega rápida, segura y confiable.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-dark-hover border border-dark-border text-gray-400 hover:text-primary hover:border-primary/40 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Servicios</h4>
            <ul className="space-y-2">
              {['Rastreo de paquetes','Envío express','Cobertura nacional','Calculadora de tarifas','Garantías de entrega'].map(s => (
                <li key={s}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-primary shrink-0" />
                <span>+502 2222-3333</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-primary shrink-0" />
                <span>info@speedcargo.gt</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span>6a Av. 12-36, Zona 10<br />Guatemala, Guatemala</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Speed Cargo. Todos los derechos reservados.
          </p>
          <div className="flex gap-5">
            {['Privacidad','Términos','Cookies'].map(t => (
              <a key={t} href="#" className="text-xs text-gray-500 hover:text-primary transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
