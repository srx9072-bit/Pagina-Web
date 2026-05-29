import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home      from './pages/Home';
import Tracking  from './pages/Tracking';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Loader    from './components/ui/Loader';

function ProtectedRoute({ children, requireAdmin }) {
  const { user, loading, isOperator } = useAuth();
  if (loading) return <Loader fullscreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isOperator) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <Loader fullscreen />;

  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/rastrear"  element={<Tracking />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute requireAdmin>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
