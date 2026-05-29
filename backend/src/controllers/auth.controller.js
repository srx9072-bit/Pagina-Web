const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { sql, withPool } = require('../config/database');

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const result = await withPool(p =>
      p.request()
        .input('email', sql.NVarChar, email.toLowerCase().trim())
        .query('SELECT * FROM usuarios WHERE email = @email AND activo = 1')
    );

    const user = result.recordset[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol, telefono: user.telefono }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    if (password.length < 6)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

    const existing = await withPool(p =>
      p.request()
        .input('email', sql.NVarChar, email.toLowerCase().trim())
        .query('SELECT id FROM usuarios WHERE email = @email')
    );
    if (existing.recordset.length > 0)
      return res.status(400).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 12);
    const inserted = await withPool(p =>
      p.request()
        .input('nombre',   sql.NVarChar, nombre.trim())
        .input('email',    sql.NVarChar, email.toLowerCase().trim())
        .input('hash',     sql.NVarChar, hash)
        .input('telefono', sql.NVarChar, telefono || null)
        .query(`
          INSERT INTO usuarios (nombre, email, password_hash, telefono, rol)
          OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.email, INSERTED.rol, INSERTED.telefono
          VALUES (@nombre, @email, @hash, @telefono, 'cliente')
        `)
    );

    const user  = inserted.recordset[0];
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const me = async (req, res) => {
  try {
    const result = await withPool(p =>
      p.request()
        .input('id', sql.Int, req.user.id)
        .query('SELECT id, nombre, email, rol, telefono, created_at FROM usuarios WHERE id = @id AND activo = 1')
    );
    if (!result.recordset[0])
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { login, register, me };
