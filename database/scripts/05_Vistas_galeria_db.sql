-- =============================================
-- VISTAS DE LA BASE DE DATOS GALERIA_DB
-- AUTORES: JOSUÉ SOLÓRZANO - ALEJANDRO CHAVES - DANIEL GONZÁLEZ - RANDY VILLARREAL
-- =============================================
use galeria_db
go

-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosArtistas
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "artista"
-- =============================================
CREATE VIEW vMostrarTodosArtistas AS
SELECT * FROM artista
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosDetallesFactura
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "detallesFactura"
-- =============================================
CREATE VIEW vMostrarTodosDetallesFactura AS
SELECT * FROM detallesFactura
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosEnvios
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "envios"
-- =============================================
CREATE VIEW vMostrarTodosEnvios AS
SELECT * FROM envios
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosFacturas
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "facturas"
-- =============================================
CREATE VIEW vMostrarTodosFacturas AS
SELECT * FROM facturas
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosMatriculas
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "matriculas"
-- =============================================
CREATE VIEW vMostrarTodosMatriculas AS
SELECT * FROM matriculas
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosObras
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "obras"
-- =============================================
CREATE VIEW vMostrarTodosObras AS
SELECT * FROM obras
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosOfertas
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "ofertas"
-- =============================================
CREATE VIEW vMostrarTodosOfertas AS
SELECT * FROM ofertas
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosTalleres
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "talleres"
-- =============================================
CREATE VIEW vMostrarTodosTalleres AS
SELECT * FROM talleres
GO


-- =============================================
-- Autor: Josué Solórzano, vMostrarTodosUsuarios
-- Fecha de Creación: 06/09/2024
-- Descripción:	Vista que permite traer todos los elementos de la tabla "users"
-- =============================================
CREATE VIEW vMostrarTodosUsuarios AS
SELECT * FROM users
GO


