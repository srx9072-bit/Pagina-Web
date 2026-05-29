const { sql, withPool } = require('../config/database');

const generateGuia = () => {
  const ts  = Date.now().toString().slice(-7);
  const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SC${ts}${rnd}`;
};

const getAll = async (req, res) => {
  try {
    const { estado, search, page = 1, limit = 15 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await withPool(async p => {
      const req1 = p.request();
      const conditions = [];

      if (estado) {
        conditions.push('p.estado = @estado');
        req1.input('estado', sql.NVarChar, estado);
      }
      if (search) {
        conditions.push('(p.guia LIKE @search OR c.nombre LIKE @search OR p.destino_departamento LIKE @search)');
        req1.input('search', sql.NVarChar, `%${search}%`);
      }
      if (req.user.rol === 'cliente') {
        conditions.push('p.usuario_id = @userId');
        req1.input('userId', sql.Int, req.user.id);
      }

      const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
      req1.input('limit',  sql.Int, parseInt(limit));
      req1.input('offset', sql.Int, offset);

      return req1.query(`
        SELECT p.*,
               c.nombre   AS cliente_nombre,
               c.email    AS cliente_email,
               c.telefono AS cliente_telefono,
               u.nombre   AS operador_nombre,
               COUNT(*) OVER() AS total_count
        FROM paquetes p
        LEFT JOIN clientes c ON p.cliente_id = c.id
        LEFT JOIN usuarios u ON p.operador_id = u.id
        ${where}
        ORDER BY p.created_at DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
    });

    const total = result.recordset.length > 0 ? result.recordset[0].total_count : 0;
    res.json({
      packages:   result.recordset,
      total,
      page:       parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1
    });
  } catch (err) {
    console.error('Get packages error:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const trackByGuia = async (req, res) => {
  try {
    const { guia } = req.params;

    // Una sola query con dos result sets — evita conexiones paralelas
    const result = await withPool(p =>
      p.request()
        .input('guia', sql.NVarChar, guia.toUpperCase().trim())
        .query(`
          SELECT p.guia, p.estado, p.descripcion, p.peso_lbs, p.cantidad,
                 p.origen_departamento, p.origen_municipio,
                 p.destino_departamento, p.destino_municipio,
                 p.direccion_entrega, p.tipo_envio, p.costo_total,
                 p.fecha_estimada_entrega, p.fecha_entrega, p.created_at, p.updated_at,
                 c.nombre   AS cliente_nombre,
                 c.telefono AS cliente_telefono
          FROM paquetes p
          LEFT JOIN clientes c ON p.cliente_id = c.id
          WHERE p.guia = @guia;

          SELECT h.estado, h.ubicacion, h.observacion, h.created_at
          FROM historial_estados h
          INNER JOIN paquetes pk ON h.paquete_id = pk.id
          WHERE pk.guia = @guia
          ORDER BY h.created_at ASC;
        `)
    );

    const paquete  = result.recordsets[0][0];
    const historial = result.recordsets[1];

    if (!paquete)
      return res.status(404).json({ error: 'Paquete no encontrado. Verifica el número de guía.' });

    res.json({ ...paquete, historial });
  } catch (err) {
    console.error('Track error:', err.message, '| code:', err.code, '| number:', err.number);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const pkg = await withPool(async p => {
      const {
        cliente_nombre, cliente_email, cliente_telefono,
        descripcion, peso_lbs, cantidad,
        origen_departamento, origen_municipio,
        destino_departamento, destino_municipio,
        direccion_entrega, tipo_envio, costo_total,
        observaciones, fecha_estimada_entrega
      } = req.body;

      if (!cliente_nombre || !destino_departamento || !direccion_entrega)
        throw Object.assign(new Error('Datos requeridos faltantes'), { status: 400 });

      const tx = new sql.Transaction(p);
      await tx.begin();
      try {
        let clienteId;
        if (cliente_email) {
          const ec = await new sql.Request(tx)
            .input('email', sql.NVarChar, cliente_email)
            .query('SELECT id FROM clientes WHERE email = @email');
          if (ec.recordset.length > 0) {
            clienteId = ec.recordset[0].id;
            await new sql.Request(tx)
              .input('n',  sql.NVarChar, cliente_nombre)
              .input('t',  sql.NVarChar, cliente_telefono || null)
              .input('id', sql.Int,      clienteId)
              .query('UPDATE clientes SET nombre = @n, telefono = COALESCE(@t, telefono) WHERE id = @id');
          }
        }
        if (!clienteId) {
          const nc = await new sql.Request(tx)
            .input('nombre',   sql.NVarChar, cliente_nombre)
            .input('email',    sql.NVarChar, cliente_email    || null)
            .input('telefono', sql.NVarChar, cliente_telefono || null)
            .query('INSERT INTO clientes (nombre, email, telefono) OUTPUT INSERTED.id VALUES (@nombre, @email, @telefono)');
          clienteId = nc.recordset[0].id;
        }

        const guia    = generateGuia();
        const pkgRes  = await new sql.Request(tx)
          .input('guia',  sql.NVarChar,      guia)
          .input('cId',   sql.Int,            clienteId)
          .input('uId',   sql.Int,            req.user.id)
          .input('desc',  sql.NVarChar,       descripcion          || null)
          .input('peso',  sql.Decimal(8,2),   parseFloat(peso_lbs) || 1)
          .input('cant',  sql.Int,            parseInt(cantidad)   || 1)
          .input('oDep',  sql.NVarChar,       origen_departamento  || 'Guatemala')
          .input('oMun',  sql.NVarChar,       origen_municipio     || 'Guatemala')
          .input('dDep',  sql.NVarChar,       destino_departamento)
          .input('dMun',  sql.NVarChar,       destino_municipio    || null)
          .input('dir',   sql.NVarChar,       direccion_entrega)
          .input('tipo',  sql.NVarChar,       tipo_envio           || 'normal')
          .input('costo', sql.Decimal(10,2),  parseFloat(costo_total) || null)
          .input('obs',   sql.NVarChar,       observaciones        || null)
          .input('fEst',  sql.Date,           fecha_estimada_entrega ? new Date(fecha_estimada_entrega) : null)
          .query(`
            INSERT INTO paquetes (guia,cliente_id,usuario_id,operador_id,descripcion,peso_lbs,cantidad,
              origen_departamento,origen_municipio,destino_departamento,destino_municipio,
              direccion_entrega,tipo_envio,costo_total,observaciones,fecha_estimada_entrega,estado)
            OUTPUT INSERTED.*
            VALUES (@guia,@cId,@uId,@uId,@desc,@peso,@cant,@oDep,@oMun,@dDep,@dMun,@dir,@tipo,@costo,@obs,@fEst,'en_transito')
          `);

        await new sql.Request(tx)
          .input('pkgId',  sql.Int,      pkgRes.recordset[0].id)
          .input('ubic',   sql.NVarChar, `${origen_departamento || 'Guatemala'}, ${origen_municipio || 'Guatemala'}`)
          .input('userId', sql.Int,      req.user.id)
          .query(`INSERT INTO historial_estados (paquete_id,estado,ubicacion,observacion,usuario_id)
                  VALUES (@pkgId,'en_transito',@ubic,'Paquete registrado y despachado',@userId)`);

        await tx.commit();
        return pkgRes.recordset[0];
      } catch (e) {
        await tx.rollback().catch(() => {});
        throw e;
      }
    });

    res.status(201).json(pkg);
  } catch (err) {
    console.error('Create package error:', err.message);
    const status = err.status || 500;
    res.status(status).json({ error: err.status ? err.message : 'Error del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const updated = await withPool(async p => {
      const { id }                          = req.params;
      const { estado, observaciones, ubicacion } = req.body;

      const tx = new sql.Transaction(p);
      await tx.begin();
      try {
        const existing = await new sql.Request(tx)
          .input('id', sql.Int, parseInt(id))
          .query('SELECT id FROM paquetes WHERE id = @id');
        if (!existing.recordset[0]) {
          await tx.rollback();
          throw Object.assign(new Error('Paquete no encontrado'), { status: 404 });
        }

        const sets = ['updated_at = GETDATE()'];
        const r    = new sql.Request(tx).input('id', sql.Int, parseInt(id));

        if (estado) {
          sets.push('estado = @estado');
          r.input('estado', sql.NVarChar, estado);
          if (estado === 'entregado') sets.push('fecha_entrega = GETDATE()');
        }
        if (observaciones !== undefined) {
          sets.push('observaciones = @obs');
          r.input('obs', sql.NVarChar, observaciones);
        }

        const result = await r.query(
          `UPDATE paquetes SET ${sets.join(', ')} OUTPUT INSERTED.* WHERE id = @id`
        );

        if (estado) {
          await new sql.Request(tx)
            .input('pkgId',  sql.Int,      parseInt(id))
            .input('estado', sql.NVarChar, estado)
            .input('ubic',   sql.NVarChar, ubicacion     || null)
            .input('obs',    sql.NVarChar, observaciones || null)
            .input('userId', sql.Int,      req.user.id)
            .query(`INSERT INTO historial_estados (paquete_id,estado,ubicacion,observacion,usuario_id)
                    VALUES (@pkgId,@estado,@ubic,@obs,@userId)`);
        }

        await tx.commit();
        return result.recordset[0];
      } catch (e) {
        await tx.rollback().catch(() => {});
        throw e;
      }
    });

    res.json(updated);
  } catch (err) {
    console.error('Update package error:', err.message);
    const status = err.status || 500;
    res.status(status).json({ error: err.status ? err.message : 'Error del servidor' });
  }
};

const remove = async (req, res) => {
  try {
    const result = await withPool(p =>
      p.request()
        .input('id', sql.Int, parseInt(req.params.id))
        .query('DELETE FROM paquetes OUTPUT DELETED.id WHERE id = @id')
    );
    if (!result.recordset[0])
      return res.status(404).json({ error: 'Paquete no encontrado' });
    res.json({ message: 'Paquete eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getAll, trackByGuia, create, update, remove };
