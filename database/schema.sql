-- ============================================================
-- SPEED CARGO — Schema SQL Server
-- Versión: SQL Server 2016+
-- Ejecutar en: USE SpeedCargo;  (crear la BD primero)
-- ============================================================

-- Crear la base de datos (ejecutar como sysadmin si es necesario)
-- IF DB_ID('SpeedCargo') IS NULL CREATE DATABASE SpeedCargo;
-- GO
-- USE SpeedCargo;
-- GO

-- ============================================================
-- ELIMINAR TABLAS EN ORDEN CORRECTO (dependencias)
-- ============================================================
IF OBJECT_ID('dbo.ruta_paquetes',   'U') IS NOT NULL DROP TABLE dbo.ruta_paquetes;
IF OBJECT_ID('dbo.rutas',           'U') IS NOT NULL DROP TABLE dbo.rutas;
IF OBJECT_ID('dbo.historial_estados','U') IS NOT NULL DROP TABLE dbo.historial_estados;
IF OBJECT_ID('dbo.cotizaciones',    'U') IS NOT NULL DROP TABLE dbo.cotizaciones;
IF OBJECT_ID('dbo.paquetes',        'U') IS NOT NULL DROP TABLE dbo.paquetes;
IF OBJECT_ID('dbo.clientes',        'U') IS NOT NULL DROP TABLE dbo.clientes;
IF OBJECT_ID('dbo.municipios',      'U') IS NOT NULL DROP TABLE dbo.municipios;
IF OBJECT_ID('dbo.departamentos',   'U') IS NOT NULL DROP TABLE dbo.departamentos;
IF OBJECT_ID('dbo.usuarios',        'U') IS NOT NULL DROP TABLE dbo.usuarios;
GO

-- ============================================================
-- USUARIOS (autenticación y control de acceso)
-- ============================================================
CREATE TABLE usuarios (
    id            INT            IDENTITY(1,1) PRIMARY KEY,
    nombre        NVARCHAR(100)  NOT NULL,
    email         NVARCHAR(150)  NOT NULL,
    password_hash NVARCHAR(255)  NOT NULL,
    rol           NVARCHAR(20)   NOT NULL DEFAULT 'cliente'
                  CONSTRAINT CHK_usuarios_rol CHECK (rol IN ('cliente', 'operador', 'admin')),
    telefono      NVARCHAR(20)   NULL,
    activo        BIT            NOT NULL DEFAULT 1,
    created_at    DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at    DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UQ_usuarios_email UNIQUE (email)
);
GO

-- ============================================================
-- CLIENTES (destinatarios/remitentes, pueden no estar registrados)
-- ============================================================
CREATE TABLE clientes (
    id         INT            IDENTITY(1,1) PRIMARY KEY,
    nombre     NVARCHAR(100)  NOT NULL,
    email      NVARCHAR(150)  NULL,
    telefono   NVARCHAR(20)   NULL,
    direccion  NVARCHAR(MAX)  NULL,
    nit        NVARCHAR(20)   NULL,
    created_at DATETIME2      NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- DEPARTAMENTOS DE GUATEMALA (22 departamentos)
-- ============================================================
CREATE TABLE departamentos (
    id           INT           IDENTITY(1,1) PRIMARY KEY,
    nombre       NVARCHAR(100) NOT NULL,
    tipo_tiempo  NVARCHAR(10)  NULL
                 CONSTRAINT CHK_depto_tipo CHECK (tipo_tiempo IN ('mismo', '24', '48', '72')),
    tiempo_label NVARCHAR(60)  NULL,
    codigo_iso   NVARCHAR(5)   NULL
);
GO

-- ============================================================
-- MUNICIPIOS
-- ============================================================
CREATE TABLE municipios (
    id              INT           IDENTITY(1,1) PRIMARY KEY,
    departamento_id INT           NOT NULL,
    nombre          NVARCHAR(100) NOT NULL,
    CONSTRAINT FK_municipios_departamento FOREIGN KEY (departamento_id)
        REFERENCES departamentos(id) ON DELETE CASCADE
);
GO

-- ============================================================
-- PAQUETES (núcleo del sistema)
-- ============================================================
CREATE TABLE paquetes (
    id                     INT            IDENTITY(1,1) PRIMARY KEY,
    guia                   NVARCHAR(20)   NOT NULL,
    cliente_id             INT            NULL,
    usuario_id             INT            NULL,
    operador_id            INT            NULL,
    descripcion            NVARCHAR(MAX)  NULL,
    peso_lbs               DECIMAL(8,2)   NOT NULL DEFAULT 1.0
                           CONSTRAINT CHK_paquetes_peso CHECK (peso_lbs > 0),
    cantidad               INT            NOT NULL DEFAULT 1
                           CONSTRAINT CHK_paquetes_cantidad CHECK (cantidad > 0),
    origen_departamento    NVARCHAR(100)  NOT NULL DEFAULT 'Guatemala',
    origen_municipio       NVARCHAR(100)  NOT NULL DEFAULT 'Guatemala',
    destino_departamento   NVARCHAR(100)  NOT NULL,
    destino_municipio      NVARCHAR(100)  NULL,
    direccion_entrega      NVARCHAR(MAX)  NOT NULL,
    tipo_envio             NVARCHAR(20)   NOT NULL DEFAULT 'normal'
                           CONSTRAINT CHK_paquetes_tipo CHECK (tipo_envio IN ('normal', 'express')),
    estado                 NVARCHAR(30)   NOT NULL DEFAULT 'en_transito'
                           CONSTRAINT CHK_paquetes_estado
                               CHECK (estado IN ('pendiente','en_transito','entregado','retrasado','cancelado')),
    costo_total            DECIMAL(10,2)  NULL,
    observaciones          NVARCHAR(MAX)  NULL,
    firma_receptor         NVARCHAR(200)  NULL,
    fecha_estimada_entrega DATE           NULL,
    fecha_entrega          DATETIME2      NULL,
    created_at             DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at             DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UQ_paquetes_guia UNIQUE (guia),
    CONSTRAINT FK_paquetes_cliente  FOREIGN KEY (cliente_id)  REFERENCES clientes(id),
    CONSTRAINT FK_paquetes_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id),
    CONSTRAINT FK_paquetes_operador FOREIGN KEY (operador_id) REFERENCES usuarios(id)
);
GO

-- ============================================================
-- HISTORIAL DE ESTADOS (trazabilidad completa del paquete)
-- ============================================================
CREATE TABLE historial_estados (
    id          INT            IDENTITY(1,1) PRIMARY KEY,
    paquete_id  INT            NOT NULL,
    estado      NVARCHAR(30)   NOT NULL,
    ubicacion   NVARCHAR(200)  NULL,
    observacion NVARCHAR(MAX)  NULL,
    usuario_id  INT            NULL,
    created_at  DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_historial_paquete FOREIGN KEY (paquete_id)
        REFERENCES paquetes(id) ON DELETE CASCADE,
    CONSTRAINT FK_historial_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);
GO

-- ============================================================
-- COTIZACIONES
-- ============================================================
CREATE TABLE cotizaciones (
    id                   INT            IDENTITY(1,1) PRIMARY KEY,
    usuario_id           INT            NULL,
    destino_tipo         NVARCHAR(20)   NULL
                         CONSTRAINT CHK_cot_destino CHECK (destino_tipo IN ('capital', 'exterior')),
    destino_departamento NVARCHAR(100)  NULL,
    destino_municipio    NVARCHAR(100)  NULL,
    tipo_envio           NVARCHAR(20)   NOT NULL DEFAULT 'normal',
    peso_lbs             DECIMAL(8,2)   NULL,
    cantidad             INT            NULL,
    total                DECIMAL(10,2)  NOT NULL,
    created_at           DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_cotizaciones_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
GO

-- ============================================================
-- RUTAS DE REPARTO
-- ============================================================
CREATE TABLE rutas (
    id             INT            IDENTITY(1,1) PRIMARY KEY,
    nombre         NVARCHAR(200)  NULL,
    origen         NVARCHAR(200)  NULL,
    destino        NVARCHAR(200)  NULL,
    distancia_km   DECIMAL(8,2)   NULL,
    tiempo_minutos INT            NULL,
    conductor_id   INT            NULL,
    estado         NVARCHAR(20)   NOT NULL DEFAULT 'planificada'
                   CONSTRAINT CHK_rutas_estado
                       CHECK (estado IN ('planificada','en_curso','completada','cancelada')),
    fecha_salida   DATETIME2      NULL,
    fecha_llegada  DATETIME2      NULL,
    created_at     DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_rutas_conductor FOREIGN KEY (conductor_id)
        REFERENCES usuarios(id)
);
GO

-- ============================================================
-- RELACIÓN N:N RUTAS ↔ PAQUETES
-- ============================================================
CREATE TABLE ruta_paquetes (
    ruta_id    INT NOT NULL,
    paquete_id INT NOT NULL,
    CONSTRAINT PK_ruta_paquetes PRIMARY KEY (ruta_id, paquete_id),
    CONSTRAINT FK_rp_ruta    FOREIGN KEY (ruta_id)    REFERENCES rutas(id)    ON DELETE CASCADE,
    CONSTRAINT FK_rp_paquete FOREIGN KEY (paquete_id) REFERENCES paquetes(id) ON DELETE CASCADE
);
GO

-- ============================================================
-- ÍNDICES DE RENDIMIENTO
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_paquetes_guia' AND object_id = OBJECT_ID('paquetes'))
    CREATE INDEX IX_paquetes_guia       ON paquetes(guia);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_paquetes_estado' AND object_id = OBJECT_ID('paquetes'))
    CREATE INDEX IX_paquetes_estado     ON paquetes(estado);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_paquetes_cliente' AND object_id = OBJECT_ID('paquetes'))
    CREATE INDEX IX_paquetes_cliente    ON paquetes(cliente_id);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_paquetes_created' AND object_id = OBJECT_ID('paquetes'))
    CREATE INDEX IX_paquetes_created    ON paquetes(created_at DESC);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_historial_paquete' AND object_id = OBJECT_ID('historial_estados'))
    CREATE INDEX IX_historial_paquete   ON historial_estados(paquete_id);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_cotizaciones_usr' AND object_id = OBJECT_ID('cotizaciones'))
    CREATE INDEX IX_cotizaciones_usr    ON cotizaciones(usuario_id);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_usuarios_email' AND object_id = OBJECT_ID('usuarios'))
    CREATE INDEX IX_usuarios_email      ON usuarios(email);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_municipios_depto' AND object_id = OBJECT_ID('municipios'))
    CREATE INDEX IX_municipios_depto    ON municipios(departamento_id);
GO

PRINT 'Schema SpeedCargo creado exitosamente.';
GO
