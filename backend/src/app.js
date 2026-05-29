const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const packagesRoutes = require('./routes/packages.routes');
const quotesRoutes = require('./routes/quotes.routes');
const statsRoutes = require('./routes/stats.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Speed Cargo API está funcionando', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', usersRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
