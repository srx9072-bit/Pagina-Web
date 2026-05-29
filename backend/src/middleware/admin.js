const admin = (req, res, next) => {
  if (!req.user || !['admin', 'operador'].includes(req.user.rol)) {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

const superAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

module.exports = { admin, superAdmin };
