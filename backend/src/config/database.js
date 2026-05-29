const sql = require('mssql');

const config = {
  server:   process.env.DB_SERVER   || 'localhost',
  port:     parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME     || 'SpeedCargo',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt:                false,
    trustServerCertificate: true,
    enableArithAbort:       true,
    connectTimeout:         30000,
    requestTimeout:         30000,
    cryptoCredentialsDetails: { minVersion: 'TLSv1' }
  }
};

/**
 * Abre una conexión fresca, ejecuta fn(pool) y la cierra siempre.
 * Evita los problemas de pool con ECONNRESET en SQL Server local.
 */
const withPool = async (fn) => {
  const pool = new sql.ConnectionPool(config);
  pool.on('error', () => {}); // evita crash por evento 'error' sin listener
  await pool.connect();
  try {
    return await fn(pool);
  } finally {
    await pool.close().catch(() => {});
  }
};

module.exports = { sql, withPool };
