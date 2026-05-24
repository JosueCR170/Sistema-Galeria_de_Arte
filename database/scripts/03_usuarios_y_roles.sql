-- =============================================
-- Autor: Josué Solórzano
-- Fecha de Creación: 14/10/2024
-- Descripción:	Usuario que solo tiene permisos de lectura en la base de datos
-- =============================================
CREATE LOGIN [readOnly] WITH PASSWORD = 'readUser';
GO
USE galeria_db;
GO
CREATE USER [readOnly] FOR LOGIN [readOnly];
GO
EXEC sp_addrolemember 'db_datareader', 'readOnly';
GO


-- =============================================
-- Autor: Randy Villarreal
-- Fecha de Creación: 14/10/2024
-- Descripción:	Usuario encargado de la administración de las facturas, detallesFactura, envios, 
--matriculas, ofertas y de ver los artistas, obras, talleres y usuarios
-- =============================================
USE galeria_db
GO
CREATE ROLE EncargadoFacturas
GO

GRANT SELECT ON dbo.artista TO EncargadoFacturas
GRANT SELECT ON dbo.obras TO EncargadoFacturas
GRANT SELECT ON dbo.talleres TO EncargadoFacturas
GRANT SELECT ON dbo.users TO EncargadoFacturas

GRANT SELECT ON dbo.facturas TO EncargadoFacturas
GRANT INSERT ON dbo.facturas TO EncargadoFacturas
GRANT UPDATE ON dbo.facturas TO EncargadoFacturas
GRANT DELETE ON dbo.facturas TO EncargadoFacturas

GRANT SELECT ON dbo.detallesFactura TO EncargadoFacturas
GRANT INSERT ON dbo.detallesFactura TO EncargadoFacturas
GRANT UPDATE ON dbo.detallesFactura TO EncargadoFacturas
GRANT DELETE ON dbo.detallesFactura TO EncargadoFacturas

GRANT SELECT ON dbo.matriculas TO EncargadoFacturas
GRANT INSERT ON dbo.matriculas TO EncargadoFacturas
GRANT UPDATE ON dbo.matriculas TO EncargadoFacturas
GRANT DELETE ON dbo.matriculas TO EncargadoFacturas

GRANT SELECT ON dbo.ofertas TO EncargadoFacturas
GRANT INSERT ON dbo.ofertas TO EncargadoFacturas
GRANT UPDATE ON dbo.ofertas TO EncargadoFacturas
GRANT DELETE ON dbo.ofertas TO EncargadoFacturas

GRANT SELECT ON dbo.envios TO EncargadoFacturas
GRANT INSERT ON dbo.envios TO EncargadoFacturas
GRANT UPDATE ON dbo.envios TO EncargadoFacturas
GRANT DELETE ON dbo.envios TO EncargadoFacturas
GO
CREATE LOGIN facturero WITH PASSWORD = 'facturero';
GO
CREATE USER facturero FOR LOGIN facturero;
GO
EXEC sp_addrolemember 'EncargadoFacturas', 'facturero';
GO