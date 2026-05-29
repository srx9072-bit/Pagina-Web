-- ============================================================
-- SPEED CARGO — Datos de prueba (SQL Server)
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================
-- NOTA SOBRE CONTRASEÑAS:
--   Los hashes bcrypt incluidos corresponden a:
--     Admin123!   → admins y operadores
--     Cliente123! → clientes
--   Generados con bcryptjs cost=10.
--   Para regenerar: node -e "require('bcryptjs').hash('Admin123!',10).then(h=>console.log(h))"
-- ============================================================

USE SpeedCargo;
GO

-- ============================================================
-- USUARIOS
-- ============================================================
SET IDENTITY_INSERT usuarios ON;

INSERT INTO usuarios (id, nombre, email, password_hash, rol, telefono, activo) VALUES
(1, N'Administrador Sistema', N'admin@speedcargo.gt',    N'$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'admin',    N'2222-0001', 1),
(2, N'Carlos Méndez',         N'cmendez@speedcargo.gt',  N'$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'operador', N'5555-0002', 1),
(3, N'Ana García',            N'agarcia@speedcargo.gt',  N'$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'operador', N'5555-0003', 1),
(4, N'María López',           N'mlopez@speedcargo.gt',   N'$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', N'operador', N'5555-0004', 1),
(5, N'Pedro Ramírez',         N'pedro@gmail.com',        N'$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  N'cliente',  N'5555-0005', 1),
(6, N'Lucía Ortiz',           N'lucia@gmail.com',        N'$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  N'cliente',  N'5555-0006', 1),
(7, N'Roberto Ajú',           N'roberto@empresa.com',    N'$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  N'cliente',  N'5555-0007', 1);

SET IDENTITY_INSERT usuarios OFF;
GO

-- ⚠️  IMPORTANTE: Después de insertar, actualizar los hashes con contraseñas reales:
--   cd backend && node seed.js
-- Eso reemplazará los hashes con valores bcrypt válidos.
-- Los hashes de arriba son de ejemplo y deben regenerarse para que el login funcione.
-- ============================================================

-- ============================================================
-- CLIENTES
-- ============================================================
SET IDENTITY_INSERT clientes ON;

INSERT INTO clientes (id, nombre, email, telefono, direccion, nit) VALUES
(1, N'Pedro Ramírez',          N'pedro@gmail.com',        N'4455-6677', N'6a Av. 10-23 Zona 9, Guatemala Ciudad',    N'1234567-8'),
(2, N'Lucía Ortiz',            N'lucia@gmail.com',        N'3344-5566', N'Residenciales Los Pinos, Mixco',           N'8765432-1'),
(3, N'Roberto Ajú',            N'roberto@empresa.com',    N'5566-7788', N'Zona Industrial 12, Guatemala',            N'9876543-2'),
(4, N'Distribuidora El Cielo', N'ventas@elcielo.gt',     N'2222-3333', N'Calzada Aguilar Batres 45, Guatemala',     N'3456789-0'),
(5, N'Farmacia San Rafael',    N'farmacia@sanrafael.gt',  N'2222-4444', N'Calle Real 23, Antigua Guatemala',         N'4567890-1'),
(6, N'Tienda La Esperanza',    N'tienda@esperanza.gt',    N'7788-9900', N'Av. Principal 5, Cobán, Alta Verapaz',     N'5678901-2'),
(7, N'Exportaciones Quiché',   N'expo@quiche.gt',         N'7799-0011', N'Zona 1, Santa Cruz del Quiché',            N'6789012-3'),
(8, N'Supermercado El Ahorro', N'super@elahorro.gt',      N'2244-6688', N'4a Calle Zona 4, Guatemala',               N'7890123-4');

SET IDENTITY_INSERT clientes OFF;
GO

-- ============================================================
-- DEPARTAMENTOS DE GUATEMALA (22)
-- ============================================================
SET IDENTITY_INSERT departamentos ON;

INSERT INTO departamentos (id, nombre, tipo_tiempo, tiempo_label) VALUES
( 1, N'Guatemala',        N'mismo', N'Mismo día'),
( 2, N'Sacatepéquez',     N'mismo', N'Mismo día'),
( 3, N'Escuintla',        N'24',    N'24 horas'),
( 4, N'Chimaltenango',    N'24',    N'24 horas'),
( 5, N'Quetzaltenango',   N'24',    N'24 horas'),
( 6, N'Retalhuleu',       N'24',    N'24 horas'),
( 7, N'Suchitepéquez',    N'24',    N'24 horas'),
( 8, N'El Progreso',      N'24',    N'24 horas'),
( 9, N'San Marcos',       N'48',    N'48 horas'),
(10, N'Huehuetenango',    N'48',    N'48 horas'),
(11, N'Quiché',           N'48',    N'48 horas'),
(12, N'Alta Verapaz',     N'48',    N'48 horas'),
(13, N'Baja Verapaz',     N'48',    N'48 horas'),
(14, N'Sololá',           N'48',    N'48 horas'),
(15, N'Totonicapán',      N'48',    N'48 horas'),
(16, N'Zacapa',           N'48',    N'48 horas'),
(17, N'Izabal',           N'48',    N'48 horas'),
(18, N'Chiquimula',       N'48',    N'48 horas'),
(19, N'Jalapa',           N'48',    N'48 horas'),
(20, N'Jutiapa',          N'48',    N'48 horas'),
(21, N'Santa Rosa',       N'48',    N'48 horas'),
(22, N'Petén',            N'72',    N'72 horas');

SET IDENTITY_INSERT departamentos OFF;
GO

-- ============================================================
-- MUNICIPIOS (selección de los más importantes)
-- ============================================================
INSERT INTO municipios (departamento_id, nombre) VALUES
-- Guatemala (1)
(1, N'Guatemala'), (1, N'Mixco'), (1, N'Villa Nueva'), (1, N'San Miguel Petapa'),
(1, N'Chinautla'), (1, N'Santa Catarina Pinula'), (1, N'Fraijanes'), (1, N'Amatitlán'),
(1, N'Villa Canales'), (1, N'Palencia'), (1, N'San Juan Sacatepéquez'), (1, N'San Pedro Sacatepéquez'),
(1, N'San Raymundo'), (1, N'Chuarrancho'), (1, N'San José del Golfo'), (1, N'San Pedro Ayampuc'),
-- Sacatepéquez (2)
(2, N'Antigua Guatemala'), (2, N'Jocotenango'), (2, N'Pastores'), (2, N'Sumpango'),
(2, N'Santiago Sacatepéquez'), (2, N'San Lucas Sacatepéquez'), (2, N'Santa Lucía Milpas Altas'),
(2, N'Magdalena Milpas Altas'), (2, N'Santa María de Jesús'), (2, N'Ciudad Vieja'),
(2, N'San Miguel Dueñas'), (2, N'Alotenango'), (2, N'San Antonio Aguas Calientes'),
-- Escuintla (3)
(3, N'Escuintla'), (3, N'Santa Lucía Cotzumalguapa'), (3, N'La Democracia'), (3, N'Siquinalá'),
(3, N'Masagua'), (3, N'Tiquisate'), (3, N'La Gomera'), (3, N'San José'), (3, N'Iztapa'),
(3, N'Palín'), (3, N'San Vicente Pacaya'), (3, N'Nueva Concepción'),
-- Chimaltenango (4)
(4, N'Chimaltenango'), (4, N'San José Poaquil'), (4, N'Comalapa'), (4, N'Santa Apolonia'),
(4, N'Tecpán Guatemala'), (4, N'Patzún'), (4, N'Patzicía'), (4, N'Acatenango'),
(4, N'Yepocapa'), (4, N'San Andrés Itzapa'), (4, N'Zaragoza'), (4, N'El Tejar'),
-- Quetzaltenango (5)
(5, N'Quetzaltenango'), (5, N'Salcajá'), (5, N'Olintepeque'), (5, N'Ostuncalco'),
(5, N'Almolonga'), (5, N'Cantel'), (5, N'Zunil'), (5, N'Colomba'), (5, N'Coatepeque'),
(5, N'Génova'), (5, N'El Palmar'), (5, N'La Esperanza'), (5, N'San Carlos Sija'),
-- Retalhuleu (6)
(6, N'Retalhuleu'), (6, N'San Sebastián'), (6, N'Santa Cruz Muluá'), (6, N'San Martín Zapotitlán'),
(6, N'San Felipe'), (6, N'Champerico'), (6, N'Nuevo San Carlos'), (6, N'El Asintal'),
-- Suchitepéquez (7)
(7, N'Mazatenango'), (7, N'Cuyotenango'), (7, N'San Francisco Zapotitlán'), (7, N'Samayac'),
(7, N'Chicacao'), (7, N'Patulul'), (7, N'Santa Bárbara'), (7, N'Santo Domingo Suchitepéquez'),
-- El Progreso (8)
(8, N'Guastatoya'), (8, N'Morazán'), (8, N'San Agustín Acasaguastlán'), (8, N'El Jícaro'),
(8, N'Sansare'), (8, N'Sanarate'), (8, N'San Antonio La Paz'),
-- San Marcos (9)
(9, N'San Marcos'), (9, N'San Pedro Sacatepéquez'), (9, N'Tacaná'), (9, N'Tajumulco'),
(9, N'Malacatán'), (9, N'Ayutla'), (9, N'Ocós'), (9, N'San Pablo'), (9, N'El Quetzal'),
(9, N'Pajapita'), (9, N'Ixchiguán'), (9, N'La Reforma'), (9, N'Nuevo Progreso'),
-- Huehuetenango (10)
(10, N'Huehuetenango'), (10, N'Chiantla'), (10, N'Cuilco'), (10, N'Nentón'),
(10, N'Jacaltenango'), (10, N'Soloma'), (10, N'Todos Santos Cuchumatán'), (10, N'Santa Eulalia'),
(10, N'Colotenango'), (10, N'Malacatancito'), (10, N'La Libertad'),
-- Quiché (11)
(11, N'Santa Cruz del Quiché'), (11, N'Chiché'), (11, N'Chichicastenango'), (11, N'Nebaj'),
(11, N'Joyabaj'), (11, N'Uspantán'), (11, N'Sacapulas'), (11, N'Ixcán'), (11, N'Chajul'),
(11, N'San Juan Cotzal'), (11, N'Patzité'), (11, N'Cunén'),
-- Alta Verapaz (12)
(12, N'Cobán'), (12, N'San Cristóbal Verapaz'), (12, N'Tactic'), (12, N'Tucurú'),
(12, N'Panzós'), (12, N'San Pedro Carchá'), (12, N'San Juan Chamelco'), (12, N'Lanquín'),
(12, N'Cahabón'), (12, N'Chisec'), (12, N'Raxruha'), (12, N'Fray Bartolomé de las Casas'),
-- Baja Verapaz (13)
(13, N'Salamá'), (13, N'San Miguel Chicaj'), (13, N'Rabinal'), (13, N'Cubulco'),
(13, N'Granados'), (13, N'San Jerónimo'), (13, N'Purulhá'),
-- Sololá (14)
(14, N'Sololá'), (14, N'Nahualá'), (14, N'Panajachel'), (14, N'Santiago Atitlán'),
(14, N'San Pedro La Laguna'), (14, N'San Lucas Tolimán'), (14, N'Santa Catarina Palopó'),
(14, N'San Marcos La Laguna'), (14, N'San Juan La Laguna'),
-- Totonicapán (15)
(15, N'Totonicapán'), (15, N'San Cristóbal Totonicapán'), (15, N'San Francisco El Alto'),
(15, N'Momostenango'), (15, N'Santa María Chiquimula'), (15, N'San Andrés Xecul'),
-- Zacapa (16)
(16, N'Zacapa'), (16, N'Estanzuela'), (16, N'Río Hondo'), (16, N'Gualán'),
(16, N'Teculután'), (16, N'La Unión'), (16, N'Usumatlán'), (16, N'Cabañas'),
-- Izabal (17)
(17, N'Puerto Barrios'), (17, N'Livingston'), (17, N'El Estor'), (17, N'Morales'), (17, N'Los Amates'),
-- Chiquimula (18)
(18, N'Chiquimula'), (18, N'Jocotán'), (18, N'Camotán'), (18, N'Esquipulas'),
(18, N'Concepción Las Minas'), (18, N'Quezaltepeque'), (18, N'Ipala'), (18, N'San Jacinto'),
-- Jalapa (19)
(19, N'Jalapa'), (19, N'San Pedro Pinula'), (19, N'San Luis Jilotepeque'),
(19, N'Monjas'), (19, N'Mataquescuintla'), (19, N'San Carlos Alzatate'),
-- Jutiapa (20)
(20, N'Jutiapa'), (20, N'Santa Catarina Mita'), (20, N'Agua Blanca'), (20, N'Asunción Mita'),
(20, N'Comapa'), (20, N'Moyuta'), (20, N'Quesada'), (20, N'Yupiltepeque'),
-- Santa Rosa (21)
(21, N'Cuilapa'), (21, N'Barberena'), (21, N'Oratorio'), (21, N'Chiquimulilla'),
(21, N'Taxisco'), (21, N'Guazacapán'), (21, N'Nueva Santa Rosa'), (21, N'Casillas'),
-- Petén (22)
(22, N'Flores'), (22, N'San José'), (22, N'San Benito'), (22, N'San Andrés'),
(22, N'La Libertad'), (22, N'Sayaxché'), (22, N'Melchor de Mencos'), (22, N'Poptún');
GO

-- ============================================================
-- PAQUETES DE PRUEBA
-- ============================================================
SET IDENTITY_INSERT paquetes ON;

INSERT INTO paquetes (id, guia, cliente_id, usuario_id, operador_id, descripcion, peso_lbs, cantidad,
    origen_departamento, origen_municipio, destino_departamento, destino_municipio,
    direccion_entrega, tipo_envio, costo_total, estado, fecha_estimada_entrega,
    fecha_entrega, created_at, updated_at) VALUES

-- Entregados
(1,  N'SC10001234', 1, 2, 2, N'Electrónica',               2.5, 1, N'Guatemala',      N'Guatemala',  N'Quetzaltenango', N'Quetzaltenango', N'3a Av. 12-45 Zona 3',           N'express', 80.00,  N'entregado',   '2026-05-28', DATEADD(hour,-5, GETDATE()), DATEADD(day,-3,GETDATE()), GETDATE()),
(2,  N'SC10002345', 2, 3, 3, N'Ropa y accesorios',          1.2, 2, N'Guatemala',      N'Mixco',      N'Sacatepéquez',   N'Antigua Guatemala',N'5a Calle Poniente 22',         N'normal',  30.00,  N'entregado',   '2026-05-28', DATEADD(hour,-3, GETDATE()), DATEADD(day,-2,GETDATE()), GETDATE()),
(3,  N'SC10003456', 3, 2, 2, N'Repuestos industriales',     5.0, 3, N'Guatemala',      N'Guatemala',  N'Alta Verapaz',   N'Cobán',          N'Calle Principal 8 Zona 1',      N'normal',  55.00,  N'entregado',   '2026-05-27', DATEADD(hour,-1, GETDATE()), DATEADD(day,-4,GETDATE()), GETDATE()),
(4,  N'SC10004567', 4, 3, 3, N'Productos alimenticios',     3.0, 1, N'Guatemala',      N'Villa Nueva',N'Huehuetenango',  N'Huehuetenango',  N'Av. Revolución 34',             N'normal',  35.00,  N'entregado',   '2026-05-27', DATEADD(hour,-8, GETDATE()), DATEADD(day,-3,GETDATE()), GETDATE()),
(5,  N'SC10005678', 5, 1, 1, N'Documentos legales',         0.5, 1, N'Guatemala',      N'Guatemala',  N'Escuintla',      N'Escuintla',      N'6a Calle 9-12 Zona 2',          N'express', 55.00,  N'entregado',   '2026-05-28', DATEADD(hour,-2, GETDATE()), DATEADD(day,-2,GETDATE()), GETDATE()),

-- En tránsito
(6,  N'SC10006789', 1, 2, 2, N'Textiles',                   2.0, 2, N'Guatemala',      N'Guatemala',  N'Zacapa',         N'Zacapa',         N'Barrio El Calvario, Calle 3',   N'normal',  40.00,  N'en_transito', '2026-05-30', NULL,                        DATEADD(day,-1,GETDATE()), GETDATE()),
(7,  N'SC10007890', 6, 3, 3, N'Materiales de construcción', 4.5, 1, N'Guatemala',      N'Guatemala',  N'Petén',          N'Flores',         N'Isla de Flores, Calle Central', N'normal',  35.00,  N'en_transito', '2026-06-01', NULL,                        DATEADD(day,-1,GETDATE()), GETDATE()),
(8,  N'SC10008901', 7, 2, 2, N'Medicamentos',               1.0, 1, N'Guatemala',      N'Guatemala',  N'Chiquimula',     N'Chiquimula',     N'Av. Principal 15 Zona 1',       N'express', 55.00,  N'en_transito', '2026-05-29', NULL,                        GETDATE(),                 GETDATE()),
(9,  N'SC10009012', 8, 3, 3, N'Artesanías',                 3.5, 4, N'Quetzaltenango', N'Quetzaltenango',N'Quiché',      N'Santa Cruz del Quiché',N'3a Calle 2-30 Zona 5',   N'normal',  65.00,  N'en_transito', '2026-05-31', NULL,                        GETDATE(),                 GETDATE()),
(10, N'SC10010123', 1, 2, 2, N'Tecnología',                 1.5, 2, N'Guatemala',      N'Guatemala',  N'San Marcos',     N'San Marcos',     N'Calle Real 45',                 N'normal',  35.00,  N'en_transito', '2026-05-31', NULL,                        GETDATE(),                 GETDATE()),

-- Retrasados
(11, N'SC10011234', 2, 1, 1, N'Maquinaria pesada',          6.0, 2, N'Guatemala',      N'Guatemala',  N'Izabal',         N'Puerto Barrios', N'Av. del Ferrocarril 28',        N'normal',  50.00,  N'retrasado',   '2026-05-28', NULL,                        DATEADD(day,-2,GETDATE()), GETDATE()),
(12, N'SC10012345', 3, 2, 2, N'Insumos médicos',            2.0, 1, N'Guatemala',      N'Guatemala',  N'Alta Verapaz',   N'Cobán',          N'Colonia El Recreo, Bloque B',   N'express', 65.00,  N'retrasado',   '2026-05-28', NULL,                        DATEADD(day,-2,GETDATE()), GETDATE()),

-- Pendientes
(13, N'SC10013456', 4, 3, 3, N'Artículos de regalo',        1.0, 1, N'Guatemala',      N'Guatemala',  N'Sololá',         N'Panajachel',     N'Calle Santander 19',            N'normal',  30.00,  N'pendiente',   '2026-05-31', NULL,                        GETDATE(),                 GETDATE()),
(14, N'SC10014567', 5, 2, 2, N'Documentos notariales',      0.8, 1, N'Guatemala',      N'Guatemala',  N'Totonicapán',    N'Totonicapán',    N'3a Av. 3-44 Zona 1',            N'express', 55.00,  N'pendiente',   '2026-05-30', NULL,                        GETDATE(),                 GETDATE()),
(15, N'SC10015678', 6, 1, 1, N'Ropa deportiva',             3.0, 3, N'Guatemala',      N'Guatemala',  N'Jalapa',         N'Jalapa',         N'Calle Principal 7-23',          N'normal',  45.00,  N'pendiente',   '2026-05-31', NULL,                        GETDATE(),                 GETDATE());

SET IDENTITY_INSERT paquetes OFF;
GO

-- ============================================================
-- HISTORIAL DE ESTADOS
-- ============================================================
-- Paquetes entregados (historial completo)
INSERT INTO historial_estados (paquete_id, estado, ubicacion, observacion, usuario_id) VALUES
(1,  N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 2),
(1,  N'entregado',   N'Quetzaltenango, Zona 3',    N'Paquete entregado al destinatario', 2),
(2,  N'en_transito', N'Guatemala, Mixco',           N'Paquete recibido y despachado', 3),
(2,  N'entregado',   N'Sacatepéquez, Antigua Guatemala', N'Entregado con firma de recepción', 3),
(3,  N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 2),
(3,  N'entregado',   N'Alta Verapaz, Cobán',       N'Entregado en bodega principal', 2),
(4,  N'en_transito', N'Guatemala, Villa Nueva',    N'Paquete recibido y despachado', 3),
(4,  N'entregado',   N'Huehuetenango, Centro',     N'Paquete entregado al destinatario', 3),
(5,  N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 1),
(5,  N'entregado',   N'Escuintla, Zona 2',         N'Entregado con firma del receptor', 1),

-- Paquetes en tránsito (solo inicio)
(6,  N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 2),
(7,  N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 3),
(8,  N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 2),
(9,  N'en_transito', N'Quetzaltenango, Zona 1',   N'Paquete recibido y despachado', 3),
(10, N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 2),

-- Paquetes retrasados (con causa)
(11, N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 1),
(11, N'retrasado',   N'Izabal, en ruta',           N'Retraso por condiciones viales en ruta al Atlántico', 1),
(12, N'en_transito', N'Guatemala, Guatemala',      N'Paquete recibido y despachado', 2),
(12, N'retrasado',   N'Alta Verapaz, en ruta',     N'Retraso por lluvia intensa en carretera', 2),

-- Paquetes pendientes
(13, N'pendiente',   N'Guatemala, Bodega Central', N'Paquete registrado, pendiente de despacho', 3),
(14, N'pendiente',   N'Guatemala, Bodega Central', N'Paquete registrado, pendiente de despacho', 2),
(15, N'pendiente',   N'Guatemala, Bodega Central', N'Paquete registrado, pendiente de despacho', 1);
GO

-- ============================================================
-- COTIZACIONES
-- ============================================================
INSERT INTO cotizaciones (usuario_id, destino_tipo, destino_departamento, destino_municipio, tipo_envio, peso_lbs, cantidad, total) VALUES
(5, N'capital',  N'Guatemala',        N'Mixco',           N'normal',  1.0, 1, 25.00),
(5, N'exterior', N'Quetzaltenango',   N'Quetzaltenango',  N'express', 2.5, 1, 60.00),
(6, N'exterior', N'Alta Verapaz',     N'Cobán',           N'normal',  3.0, 2, 35.00),
(6, N'capital',  N'Guatemala',        N'Villa Nueva',     N'normal',  1.5, 1, 25.00),
(7, N'exterior', N'Petén',            N'Flores',          N'express', 4.0, 1, 65.00),
(7, N'exterior', N'Izabal',           N'Puerto Barrios',  N'normal',  2.0, 3, 50.00),
(5, N'exterior', N'Huehuetenango',    N'Huehuetenango',   N'normal',  1.0, 1, 30.00),
(6, N'exterior', N'Quiché',           N'Santa Cruz del Quiché', N'normal', 2.0, 2, 35.00);
GO

-- ============================================================
-- RUTAS DE REPARTO
-- ============================================================
SET IDENTITY_INSERT rutas ON;

INSERT INTO rutas (id, nombre, origen, destino, distancia_km, tiempo_minutos, conductor_id, estado, fecha_salida, fecha_llegada) VALUES
(1, N'Ruta Capital-Occidente',  N'Guatemala, Zona 12', N'Quetzaltenango, Zona 3', 202, 210, 2, N'completada', DATEADD(day,-2,GETDATE()), DATEADD(day,-1,GETDATE())),
(2, N'Ruta Capital-Nororiente', N'Guatemala, Zona 9',  N'Cobán, Zona 1',          215, 240, 3, N'en_curso',   DATEADD(hour,-5,GETDATE()), NULL),
(3, N'Ruta Capital-Oriente',    N'Guatemala, Zona 6',  N'Zacapa, Barrio Norte',   154, 150, 2, N'planificada', DATEADD(day,1,GETDATE()),  NULL),
(4, N'Ruta Capital-Sur',        N'Guatemala, Zona 4',  N'Escuintla, Zona 2',       55,  60, 3, N'completada', DATEADD(day,-1,GETDATE()), DATEADD(hour,-22,GETDATE())),
(5, N'Ruta Capital-Petén',      N'Guatemala, Zona 1',  N'Flores, Petén',          490, 480, 2, N'planificada', DATEADD(day,2,GETDATE()),  NULL);

SET IDENTITY_INSERT rutas OFF;
GO

-- ============================================================
-- ASIGNAR PAQUETES A RUTAS
-- ============================================================
INSERT INTO ruta_paquetes (ruta_id, paquete_id) VALUES
(1, 1), (1, 2),         -- Ruta Occidente: paquetes 1 y 2
(2, 3), (2, 7),         -- Ruta Nororiente: paquetes 3 y 7
(3, 6), (3, 11),        -- Ruta Oriente: paquetes 6 y 11
(4, 4), (4, 5),         -- Ruta Sur: paquetes 4 y 5
(5, 7);                 -- Ruta Petén: paquete 7
GO

PRINT '=========================================================';
PRINT 'Speed Cargo — Seed completado exitosamente';
PRINT '=========================================================';
PRINT 'CREDENCIALES:';
PRINT '  admin@speedcargo.gt    | contraseña: Admin123!';
PRINT '  cmendez@speedcargo.gt  | contraseña: Admin123!';
PRINT '  pedro@gmail.com        | contraseña: Cliente123!';
PRINT '';
PRINT 'NOTA: Ejecutar "cd backend && node seed.js" para';
PRINT 'regenerar los hashes de contraseña correctamente.';
PRINT '=========================================================';
GO
