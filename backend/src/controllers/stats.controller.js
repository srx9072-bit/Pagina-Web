const { withPool } = require('../config/database');

const STATS_QUERY = `
  SELECT COUNT(*) AS total FROM paquetes;

  SELECT estado, COUNT(*) AS count FROM paquetes GROUP BY estado;

  SELECT TOP 10
         p.guia, p.estado, p.created_at,
         p.destino_departamento, p.destino_municipio, p.tipo_envio,
         c.nombre AS cliente_nombre
  FROM   paquetes p
  LEFT JOIN clientes c ON p.cliente_id = c.id
  ORDER  BY p.created_at DESC;

  SELECT ISNULL(SUM(costo_total), 0) AS total
  FROM   paquetes WHERE estado = 'entregado';

  SELECT COUNT(*) AS total FROM clientes;

  SELECT CAST(created_at AS DATE) AS dia, COUNT(*) AS count
  FROM   paquetes
  WHERE  created_at >= DATEADD(day, -7, GETDATE())
  GROUP  BY CAST(created_at AS DATE)
  ORDER  BY dia;
`;

const getDashboard = async (req, res) => {
  try {
    const result = await withPool(p => p.request().query(STATS_QUERY));

    const [rTotals, rByState, rRecientes, rIngresos, rClientes, rSemanales] = result.recordsets;

    const stateMap = {};
    rByState.forEach(r => { stateMap[r.estado] = parseInt(r.count); });

    const total      = parseInt(rTotals[0].total);
    const entregados = stateMap['entregado'] || 0;

    res.json({
      total_paquetes: total,
      en_transito:    stateMap['en_transito'] || 0,
      entregados,
      retrasados:     stateMap['retrasado']   || 0,
      pendientes:     stateMap['pendiente']   || 0,
      cancelados:     stateMap['cancelado']   || 0,
      tasa_exito:     total > 0 ? Math.round((entregados / total) * 100) : 0,
      ingresos:       parseFloat(rIngresos[0].total),
      total_clientes: parseInt(rClientes[0].total),
      recientes:      rRecientes,
      semanales:      rSemanales
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getDashboard };
