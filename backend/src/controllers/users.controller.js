const { sql, withPool } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const result = await withPool(p =>
      p.request().query(
        'SELECT id, nombre, email, rol, telefono, activo, created_at FROM usuarios ORDER BY created_at DESC'
      )
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const { id }                            = req.params;
    const { nombre, rol, activo, telefono } = req.body;

    const result = await withPool(p =>
      p.request()
        .input('nombre',   sql.NVarChar, nombre   || null)
        .input('rol',      sql.NVarChar, rol       || null)
        .input('activo',   sql.Bit,      activo !== undefined ? (activo ? 1 : 0) : null)
        .input('telefono', sql.NVarChar, telefono  || null)
        .input('id',       sql.Int,      parseInt(id))
        .query(`
          UPDATE usuarios
          SET nombre   = ISNULL(@nombre,   nombre),
              rol      = ISNULL(@rol,      rol),
              activo   = ISNULL(@activo,   activo),
              telefono = ISNULL(@telefono, telefono),
              updated_at = GETDATE()
          OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.email, INSERTED.rol, INSERTED.activo, INSERTED.telefono
          WHERE id = @id
        `)
    );

    if (!result.recordset[0])
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id)
      return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });

    await withPool(p =>
      p.request()
        .input('id', sql.Int, parseInt(id))
        .query('UPDATE usuarios SET activo = 0, updated_at = GETDATE() WHERE id = @id')
    );
    res.json({ message: 'Usuario desactivado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getAll, update, remove };
