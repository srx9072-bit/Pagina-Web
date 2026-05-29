/**
 * Speed Cargo — Seeder para SQL Server
 * Ejecutar desde la carpeta backend/:  node seed.js
 * Requiere tener el schema ya aplicado: database/schema.sql
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sql    = require('mssql');

const config = {
  server:   process.env.DB_SERVER   || 'localhost',
  port:     parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME     || 'SpeedCargo',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  options:  { encrypt: false, trustServerCertificate: true }
};

async function seed() {
  let pool;
  let transaction;
  console.log('\n🌱 Iniciando seeding de Speed Cargo (SQL Server)...\n');

  try {
    pool = await sql.connect(config);
    transaction = new sql.Transaction(pool);
    await transaction.begin();
    const r = (q) => new sql.Request(transaction).query(q);

    // ── Usuarios ────────────────────────────────────────────────
    console.log('👤 Creando usuarios...');
    const adminHash  = await bcrypt.hash('Admin123!', 10);
    const clientHash = await bcrypt.hash('Cliente123!', 10);

    await new sql.Request(transaction)
      .input('h1', sql.NVarChar, adminHash)
      .input('h2', sql.NVarChar, clientHash)
      .query(`
        -- Eliminar existentes para reiniciar
        DELETE FROM cotizaciones; DELETE FROM historial_estados;
        DELETE FROM ruta_paquetes; DELETE FROM rutas;
        DELETE FROM paquetes; DELETE FROM clientes;
        DELETE FROM municipios; DELETE FROM departamentos; DELETE FROM usuarios;
      `);

    await new sql.Request(transaction)
      .input('h1', sql.NVarChar, adminHash)
      .input('h2', sql.NVarChar, clientHash)
      .query(`
        SET IDENTITY_INSERT usuarios ON;
        INSERT INTO usuarios (id, nombre, email, password_hash, rol, telefono) VALUES
          (1, N'Administrador Sistema', N'admin@speedcargo.gt',    @h1, N'admin',    N'2222-0001'),
          (2, N'Carlos Méndez',         N'cmendez@speedcargo.gt',  @h1, N'operador', N'5555-0002'),
          (3, N'Ana García',            N'agarcia@speedcargo.gt',  @h1, N'operador', N'5555-0003'),
          (4, N'María López',           N'mlopez@speedcargo.gt',   @h1, N'operador', N'5555-0004'),
          (5, N'Pedro Ramírez',         N'pedro@gmail.com',        @h2, N'cliente',  N'5555-0005'),
          (6, N'Lucía Ortiz',           N'lucia@gmail.com',        @h2, N'cliente',  N'5555-0006'),
          (7, N'Roberto Ajú',           N'roberto@empresa.com',    @h2, N'cliente',  N'5555-0007');
        SET IDENTITY_INSERT usuarios OFF;
      `);
    console.log('  ✅ 7 usuarios creados');

    // ── Clientes ────────────────────────────────────────────────
    console.log('\n🏢 Creando clientes...');
    await r(`
      SET IDENTITY_INSERT clientes ON;
      INSERT INTO clientes (id, nombre, email, telefono, direccion, nit) VALUES
        (1, N'Pedro Ramírez',          N'pedro@gmail.com',        N'4455-6677', N'6a Av. 10-23 Zona 9, Guatemala',   N'1234567-8'),
        (2, N'Lucía Ortiz',            N'lucia@gmail.com',        N'3344-5566', N'Residenciales Los Pinos, Mixco',   N'8765432-1'),
        (3, N'Roberto Ajú',            N'roberto@empresa.com',    N'5566-7788', N'Zona Industrial 12, Guatemala',    N'9876543-2'),
        (4, N'Distribuidora El Cielo', N'ventas@elcielo.gt',     N'2222-3333', N'Calzada Aguilar Batres 45',        N'3456789-0'),
        (5, N'Farmacia San Rafael',    N'farmacia@sanrafael.gt',  N'2222-4444', N'Calle Real 23, Antigua Guatemala', N'4567890-1'),
        (6, N'Tienda La Esperanza',    N'tienda@esperanza.gt',    N'7788-9900', N'Av. Principal 5, Cobán',           N'5678901-2'),
        (7, N'Exportaciones Quiché',   N'expo@quiche.gt',         N'7799-0011', N'Zona 1, Santa Cruz del Quiché',    N'6789012-3'),
        (8, N'Supermercado El Ahorro', N'super@elahorro.gt',      N'2244-6688', N'4a Calle Zona 4, Guatemala',       N'7890123-4');
      SET IDENTITY_INSERT clientes OFF;
    `);
    console.log('  ✅ 8 clientes creados');

    // ── Departamentos ────────────────────────────────────────────
    console.log('\n🗺️  Creando departamentos y municipios...');
    await r(`
      SET IDENTITY_INSERT departamentos ON;
      INSERT INTO departamentos (id, nombre, tipo_tiempo, tiempo_label) VALUES
        ( 1,N'Guatemala',      N'mismo',N'Mismo día'),( 2,N'Sacatepéquez',  N'mismo',N'Mismo día'),
        ( 3,N'Escuintla',      N'24',   N'24 horas'), ( 4,N'Chimaltenango', N'24',   N'24 horas'),
        ( 5,N'Quetzaltenango', N'24',   N'24 horas'), ( 6,N'Retalhuleu',    N'24',   N'24 horas'),
        ( 7,N'Suchitepéquez',  N'24',   N'24 horas'), ( 8,N'El Progreso',   N'24',   N'24 horas'),
        ( 9,N'San Marcos',     N'48',   N'48 horas'), (10,N'Huehuetenango', N'48',   N'48 horas'),
        (11,N'Quiché',         N'48',   N'48 horas'), (12,N'Alta Verapaz',  N'48',   N'48 horas'),
        (13,N'Baja Verapaz',   N'48',   N'48 horas'), (14,N'Sololá',        N'48',   N'48 horas'),
        (15,N'Totonicapán',    N'48',   N'48 horas'), (16,N'Zacapa',        N'48',   N'48 horas'),
        (17,N'Izabal',         N'48',   N'48 horas'), (18,N'Chiquimula',    N'48',   N'48 horas'),
        (19,N'Jalapa',         N'48',   N'48 horas'), (20,N'Jutiapa',       N'48',   N'48 horas'),
        (21,N'Santa Rosa',     N'48',   N'48 horas'), (22,N'Petén',         N'72',   N'72 horas');
      SET IDENTITY_INSERT departamentos OFF;
    `);

    const municipiosBatch = [
      [1,'Guatemala'],[1,'Mixco'],[1,'Villa Nueva'],[1,'San Miguel Petapa'],[1,'Chinautla'],[1,'Santa Catarina Pinula'],[1,'Fraijanes'],[1,'Amatitlán'],[1,'Villa Canales'],[1,'Palencia'],[1,'San Juan Sacatepéquez'],[1,'San Pedro Sacatepéquez'],
      [2,'Antigua Guatemala'],[2,'Jocotenango'],[2,'Pastores'],[2,'Sumpango'],[2,'Santiago Sacatepéquez'],[2,'San Lucas Sacatepéquez'],[2,'Ciudad Vieja'],[2,'Alotenango'],
      [3,'Escuintla'],[3,'Santa Lucía Cotzumalguapa'],[3,'La Democracia'],[3,'Tiquisate'],[3,'Palín'],[3,'Nueva Concepción'],
      [4,'Chimaltenango'],[4,'Comalapa'],[4,'Tecpán Guatemala'],[4,'Patzún'],[4,'Patzicía'],[4,'El Tejar'],
      [5,'Quetzaltenango'],[5,'Salcajá'],[5,'Ostuncalco'],[5,'Almolonga'],[5,'Cantel'],[5,'Coatepeque'],[5,'La Esperanza'],
      [6,'Retalhuleu'],[6,'Champerico'],[6,'Nuevo San Carlos'],
      [7,'Mazatenango'],[7,'Cuyotenango'],[7,'Chicacao'],[7,'Patulul'],
      [8,'Guastatoya'],[8,'Morazán'],[8,'Sansare'],[8,'Sanarate'],
      [9,'San Marcos'],[9,'Tacaná'],[9,'Tajumulco'],[9,'Malacatán'],[9,'Ayutla'],[9,'Pajapita'],
      [10,'Huehuetenango'],[10,'Chiantla'],[10,'Jacaltenango'],[10,'Todos Santos Cuchumatán'],[10,'La Libertad'],
      [11,'Santa Cruz del Quiché'],[11,'Chichicastenango'],[11,'Nebaj'],[11,'Joyabaj'],[11,'Ixcán'],
      [12,'Cobán'],[12,'San Cristóbal Verapaz'],[12,'Tactic'],[12,'Panzós'],[12,'San Pedro Carchá'],[12,'Chisec'],[12,'Raxruha'],
      [13,'Salamá'],[13,'Rabinal'],[13,'Cubulco'],[13,'San Jerónimo'],
      [14,'Sololá'],[14,'Nahualá'],[14,'Panajachel'],[14,'Santiago Atitlán'],[14,'San Pedro La Laguna'],
      [15,'Totonicapán'],[15,'San Francisco El Alto'],[15,'Momostenango'],
      [16,'Zacapa'],[16,'Río Hondo'],[16,'Gualán'],[16,'La Unión'],
      [17,'Puerto Barrios'],[17,'Livingston'],[17,'El Estor'],[17,'Morales'],
      [18,'Chiquimula'],[18,'Jocotán'],[18,'Esquipulas'],[18,'Ipala'],
      [19,'Jalapa'],[19,'San Pedro Pinula'],[19,'Mataquescuintla'],
      [20,'Jutiapa'],[20,'Asunción Mita'],[20,'Comapa'],[20,'Quesada'],
      [21,'Cuilapa'],[21,'Barberena'],[21,'Chiquimulilla'],[21,'Nueva Santa Rosa'],
      [22,'Flores'],[22,'San Benito'],[22,'La Libertad'],[22,'Sayaxché'],[22,'Melchor de Mencos'],[22,'Poptún']
    ];

    for (const [dId, mNombre] of municipiosBatch) {
      await new sql.Request(transaction)
        .input('d', sql.Int, dId)
        .input('m', sql.NVarChar, mNombre)
        .query('INSERT INTO municipios (departamento_id, nombre) VALUES (@d, @m)');
    }
    console.log(`  ✅ 22 departamentos + ${municipiosBatch.length} municipios`);

    // ── Paquetes ─────────────────────────────────────────────────
    console.log('\n📦 Creando paquetes...');
    await r(`
      SET IDENTITY_INSERT paquetes ON;
      INSERT INTO paquetes (id,guia,cliente_id,usuario_id,operador_id,descripcion,peso_lbs,cantidad,origen_departamento,origen_municipio,destino_departamento,destino_municipio,direccion_entrega,tipo_envio,costo_total,estado,fecha_estimada_entrega,fecha_entrega,created_at,updated_at) VALUES
      (1, N'SC10001234',1,2,2,N'Electrónica',              2.5,1,N'Guatemala',     N'Guatemala',     N'Quetzaltenango',N'Quetzaltenango',N'3a Av. 12-45 Zona 3',          N'express',80.00, N'entregado',  '2026-05-28',DATEADD(h,-5,GETDATE()),DATEADD(d,-3,GETDATE()),GETDATE()),
      (2, N'SC10002345',2,3,3,N'Ropa y accesorios',        1.2,2,N'Guatemala',     N'Mixco',         N'Sacatepéquez',  N'Antigua Guatemala',N'5a Calle Poniente 22',      N'normal', 30.00, N'entregado',  '2026-05-28',DATEADD(h,-3,GETDATE()),DATEADD(d,-2,GETDATE()),GETDATE()),
      (3, N'SC10003456',3,2,2,N'Repuestos industriales',   5.0,3,N'Guatemala',     N'Guatemala',     N'Alta Verapaz',  N'Cobán',          N'Calle Principal 8 Zona 1',    N'normal', 55.00, N'entregado',  '2026-05-27',DATEADD(h,-1,GETDATE()),DATEADD(d,-4,GETDATE()),GETDATE()),
      (4, N'SC10004567',4,3,3,N'Productos alimenticios',   3.0,1,N'Guatemala',     N'Villa Nueva',   N'Huehuetenango', N'Huehuetenango',  N'Av. Revolución 34',           N'normal', 35.00, N'entregado',  '2026-05-27',DATEADD(h,-8,GETDATE()),DATEADD(d,-3,GETDATE()),GETDATE()),
      (5, N'SC10005678',5,1,1,N'Documentos legales',       0.5,1,N'Guatemala',     N'Guatemala',     N'Escuintla',     N'Escuintla',      N'6a Calle 9-12 Zona 2',        N'express',55.00, N'entregado',  '2026-05-28',DATEADD(h,-2,GETDATE()),DATEADD(d,-2,GETDATE()),GETDATE()),
      (6, N'SC10006789',1,2,2,N'Textiles',                 2.0,2,N'Guatemala',     N'Guatemala',     N'Zacapa',        N'Zacapa',         N'Barrio El Calvario, Calle 3', N'normal', 40.00, N'en_transito','2026-05-30',NULL,                   DATEADD(d,-1,GETDATE()),GETDATE()),
      (7, N'SC10007890',6,3,3,N'Materiales construcción',  4.5,1,N'Guatemala',     N'Guatemala',     N'Petén',         N'Flores',         N'Isla de Flores, Calle Central',N'normal', 35.00, N'en_transito','2026-06-01',NULL,                   DATEADD(d,-1,GETDATE()),GETDATE()),
      (8, N'SC10008901',7,2,2,N'Medicamentos',             1.0,1,N'Guatemala',     N'Guatemala',     N'Chiquimula',    N'Chiquimula',     N'Av. Principal 15 Zona 1',     N'express',55.00, N'en_transito','2026-05-29',NULL,                   GETDATE(),              GETDATE()),
      (9, N'SC10009012',8,3,3,N'Artesanías',               3.5,4,N'Quetzaltenango',N'Quetzaltenango',N'Quiché',        N'Santa Cruz del Quiché',N'3a Calle 2-30',          N'normal', 65.00, N'en_transito','2026-05-31',NULL,                   GETDATE(),              GETDATE()),
      (10,N'SC10010123',1,2,2,N'Tecnología',               1.5,2,N'Guatemala',     N'Guatemala',     N'San Marcos',    N'San Marcos',     N'Calle Real 45',               N'normal', 35.00, N'en_transito','2026-05-31',NULL,                   GETDATE(),              GETDATE()),
      (11,N'SC10011234',2,1,1,N'Maquinaria pesada',        6.0,2,N'Guatemala',     N'Guatemala',     N'Izabal',        N'Puerto Barrios', N'Av. del Ferrocarril 28',      N'normal', 50.00, N'retrasado',  '2026-05-28',NULL,                   DATEADD(d,-2,GETDATE()),GETDATE()),
      (12,N'SC10012345',3,2,2,N'Insumos médicos',          2.0,1,N'Guatemala',     N'Guatemala',     N'Alta Verapaz',  N'Cobán',          N'Colonia El Recreo B',         N'express',65.00, N'retrasado',  '2026-05-28',NULL,                   DATEADD(d,-2,GETDATE()),GETDATE()),
      (13,N'SC10013456',4,3,3,N'Artículos de regalo',      1.0,1,N'Guatemala',     N'Guatemala',     N'Sololá',        N'Panajachel',     N'Calle Santander 19',          N'normal', 30.00, N'pendiente',  '2026-05-31',NULL,                   GETDATE(),              GETDATE()),
      (14,N'SC10014567',5,2,2,N'Documentos notariales',    0.8,1,N'Guatemala',     N'Guatemala',     N'Totonicapán',   N'Totonicapán',    N'3a Av. 3-44 Zona 1',          N'express',55.00, N'pendiente',  '2026-05-30',NULL,                   GETDATE(),              GETDATE()),
      (15,N'SC10015678',6,1,1,N'Ropa deportiva',           3.0,3,N'Guatemala',     N'Guatemala',     N'Jalapa',        N'Jalapa',         N'Calle Principal 7-23',        N'normal', 45.00, N'pendiente',  '2026-05-31',NULL,                   GETDATE(),              GETDATE());
      SET IDENTITY_INSERT paquetes OFF;
    `);
    console.log('  ✅ 15 paquetes creados');

    // ── Historial ────────────────────────────────────────────────
    await r(`
      INSERT INTO historial_estados (paquete_id, estado, ubicacion, observacion, usuario_id) VALUES
      (1,N'en_transito',N'Guatemala, Guatemala',    N'Paquete recibido y despachado',2),
      (1,N'entregado',  N'Quetzaltenango, Zona 3',  N'Entregado al destinatario',    2),
      (2,N'en_transito',N'Guatemala, Mixco',         N'Paquete recibido y despachado',3),
      (2,N'entregado',  N'Antigua Guatemala',        N'Entregado con firma',          3),
      (3,N'en_transito',N'Guatemala',                N'Paquete recibido y despachado',2),
      (3,N'entregado',  N'Cobán, Alta Verapaz',      N'Entregado en bodega',          2),
      (4,N'en_transito',N'Guatemala, Villa Nueva',  N'Paquete recibido y despachado',3),
      (4,N'entregado',  N'Huehuetenango',            N'Entregado al destinatario',    3),
      (5,N'en_transito',N'Guatemala',                N'Paquete recibido y despachado',1),
      (5,N'entregado',  N'Escuintla, Zona 2',        N'Entregado con firma',          1),
      (6,N'en_transito',N'Guatemala',                N'Paquete recibido y despachado',2),
      (7,N'en_transito',N'Guatemala',                N'Paquete recibido y despachado',3),
      (8,N'en_transito',N'Guatemala',                N'Paquete recibido y despachado',2),
      (9,N'en_transito',N'Quetzaltenango',           N'Paquete recibido y despachado',3),
      (10,N'en_transito',N'Guatemala',               N'Paquete recibido y despachado',2),
      (11,N'en_transito',N'Guatemala',               N'Paquete recibido y despachado',1),
      (11,N'retrasado', N'Izabal, en ruta',          N'Retraso por condiciones viales',1),
      (12,N'en_transito',N'Guatemala',               N'Paquete recibido y despachado',2),
      (12,N'retrasado', N'Alta Verapaz, en ruta',    N'Retraso por lluvia intensa',   2),
      (13,N'pendiente', N'Guatemala, Bodega',        N'Pendiente de despacho',        3),
      (14,N'pendiente', N'Guatemala, Bodega',        N'Pendiente de despacho',        2),
      (15,N'pendiente', N'Guatemala, Bodega',        N'Pendiente de despacho',        1);
    `);

    // ── Cotizaciones ──────────────────────────────────────────────
    await r(`
      INSERT INTO cotizaciones (usuario_id,destino_tipo,destino_departamento,destino_municipio,tipo_envio,peso_lbs,cantidad,total) VALUES
      (5,N'capital', N'Guatemala',     N'Mixco',         N'normal', 1.0,1,25.00),
      (5,N'exterior',N'Quetzaltenango',N'Quetzaltenango',N'express',2.5,1,60.00),
      (6,N'exterior',N'Alta Verapaz',  N'Cobán',         N'normal', 3.0,2,35.00),
      (6,N'capital', N'Guatemala',     N'Villa Nueva',   N'normal', 1.5,1,25.00),
      (7,N'exterior',N'Petén',         N'Flores',        N'express',4.0,1,65.00),
      (7,N'exterior',N'Izabal',        N'Puerto Barrios',N'normal', 2.0,3,50.00);
    `);

    // ── Rutas ─────────────────────────────────────────────────────
    await r(`
      SET IDENTITY_INSERT rutas ON;
      INSERT INTO rutas (id,nombre,origen,destino,distancia_km,tiempo_minutos,conductor_id,estado,fecha_salida,fecha_llegada) VALUES
      (1,N'Ruta Capital-Occidente', N'Guatemala, Zona 12',N'Quetzaltenango, Zona 3',202,210,2,N'completada',DATEADD(d,-2,GETDATE()),DATEADD(d,-1,GETDATE())),
      (2,N'Ruta Capital-Nororiente',N'Guatemala, Zona 9', N'Cobán, Zona 1',         215,240,3,N'en_curso',  DATEADD(h,-5,GETDATE()),NULL),
      (3,N'Ruta Capital-Oriente',   N'Guatemala, Zona 6', N'Zacapa, Barrio Norte',  154,150,2,N'planificada',DATEADD(d,1,GETDATE()),NULL),
      (4,N'Ruta Capital-Sur',       N'Guatemala, Zona 4', N'Escuintla, Zona 2',      55, 60,3,N'completada',DATEADD(d,-1,GETDATE()),DATEADD(h,-22,GETDATE())),
      (5,N'Ruta Capital-Petén',     N'Guatemala, Zona 1', N'Flores, Petén',         490,480,2,N'planificada',DATEADD(d,2,GETDATE()),NULL);
      SET IDENTITY_INSERT rutas OFF;
      INSERT INTO ruta_paquetes (ruta_id,paquete_id) VALUES (1,1),(1,2),(2,3),(2,7),(3,6),(3,11),(4,4),(4,5),(5,7);
    `);

    await transaction.commit();

    console.log('\n' + '═'.repeat(55));
    console.log('✨  SEEDING COMPLETADO EXITOSAMENTE');
    console.log('═'.repeat(55));
    console.log('\nCREDENCIALES:');
    console.log('  admin@speedcargo.gt     │ Admin123!');
    console.log('  cmendez@speedcargo.gt   │ Admin123!');
    console.log('  pedro@gmail.com         │ Cliente123!');
    console.log('\nGUÍAS DE PRUEBA:');
    console.log('  En tránsito: SC10006789 · SC10007890');
    console.log('  Entregado:   SC10001234 · SC10002345');
    console.log('  Retrasado:   SC10011234');
    console.log('═'.repeat(55) + '\n');

  } catch (err) {
    if (transaction) await transaction.rollback().catch(() => {});
    console.error('\n❌ Error en seeding:', err.message);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
  }
}

seed();
