const { sql, withPool } = require('../config/database');

const RATES = {
  base_capital:      25,
  base_exterior:     30,
  express_extra:     30,
  extra_peso_por_lb:  5,
  paquete_extra:     15,
  peso_libre_lbs:     3,
  paquetes_libres:    3
};

const calcularTotal = ({ destino_tipo, tipo_envio, peso_lbs, cantidad }) => {
  let total = destino_tipo === 'capital' ? RATES.base_capital : RATES.base_exterior;
  if (tipo_envio === 'express') total += RATES.express_extra;
  total += Math.max(0, parseFloat(peso_lbs) - RATES.peso_libre_lbs) * RATES.extra_peso_por_lb;
  total += Math.max(0, parseInt(cantidad)   - RATES.paquetes_libres) * RATES.paquete_extra;
  return parseFloat(total.toFixed(2));
};

const calculate = (req, res) => {
  const { destino_tipo = 'exterior', tipo = 'normal', peso_lbs = 1, cantidad = 1 } = req.query;
  res.json({ total: calcularTotal({ destino_tipo, tipo_envio: tipo, peso_lbs, cantidad }), rates: RATES });
};

const getAll = async (req, res) => {
  try {
    const result = await withPool(p =>
      p.request()
        .input('userId', sql.Int, req.user.id)
        .query('SELECT TOP 20 * FROM cotizaciones WHERE usuario_id = @userId ORDER BY created_at DESC')
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const { destino_tipo, destino_departamento, destino_municipio, tipo_envio, peso_lbs, cantidad } = req.body;
    const total = calcularTotal({
      destino_tipo: destino_tipo || 'exterior',
      tipo_envio:   tipo_envio   || 'normal',
      peso_lbs:     peso_lbs     || 1,
      cantidad:     cantidad     || 1
    });

    const result = await withPool(p =>
      p.request()
        .input('userId',  sql.Int,           req.user.id)
        .input('dTipo',   sql.NVarChar,      destino_tipo         || null)
        .input('dDep',    sql.NVarChar,      destino_departamento || null)
        .input('dMun',    sql.NVarChar,      destino_municipio    || null)
        .input('tipo',    sql.NVarChar,      tipo_envio           || 'normal')
        .input('peso',    sql.Decimal(8,2),  parseFloat(peso_lbs) || 1)
        .input('cant',    sql.Int,           parseInt(cantidad)   || 1)
        .input('total',   sql.Decimal(10,2), total)
        .query(`
          INSERT INTO cotizaciones (usuario_id,destino_tipo,destino_departamento,destino_municipio,tipo_envio,peso_lbs,cantidad,total)
          OUTPUT INSERTED.*
          VALUES (@userId,@dTipo,@dDep,@dMun,@tipo,@peso,@cant,@total)
        `)
    );

    res.status(201).json({ ...result.recordset[0], total, rates: RATES });
  } catch (err) {
    console.error('Create quote error:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { calculate, getAll, create };
