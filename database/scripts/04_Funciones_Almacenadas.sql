-- =============================================
-- FUNCIONES ALMACENADAS DE LA BASE DE DATOS GALERIA_DB
-- AUTORES: JOSUÉ SOLÓRZANO - ALEJANDRO CHAVES - DANIEL GONZÁLEZ - RANDY VILLARREAL
-- =============================================

-- Funciones de valores de tabla en línea---------------------------------------------------

use galeria_db
go


-- =============================================
-- Autor: Randy villarreal
-- Fecha de creación: 10/10/2024
-- Descripción: Función almacenada que devuelve los envíos según su estado.
-- =============================================
if object_id('fnEstadoEnvio', 'FN') is not null
    drop function dbo.fnEstadoEnvio;
go

create function fnEstadoEnvio
(@estado varchar(30) = '%')
returns table
as
return (
	select * from envios
	where estado like @estado
)
go


-- =============================================
-- Autor: Daniel González
-- Fecha de creación: 10/10/2024
-- Descripción: Función almacenada que devuelve las matrículas de un usuario.
-- =============================================
if object_id('fnMatriculaUser', 'FN') is not null
    drop function dbo.fnMatriculaUser;
go

create function fnMatriculaUser
(@idUser bigint=0)
returns table
as
return(
	select * from matriculas
	where idUsuario like @idUser
)
go


-- Funciones escalares ------------------------------------------------------------------------------------

-- =============================================
-- Autor: Randy villarreal
-- Fecha de creación: 10/10/2024
-- Descripción: Función almacenada que devuelve la cantidad de matrículas de un taller.
-- =============================================
if object_id('fnTotalMatriculas', 'FN') is not null
    drop function dbo.fnTotalMatriculas;
go

create function fnTotalMatriculas
(@tallerId bigint)
returns int
begin
    declare @total int;
    select @total = count(*)
    from dbo.matriculas m
    inner join dbo.ofertas o on m.idOferta = o.id
    where o.idTaller = @tallerId;
    return @total;
end;
go

-- =============================================
-- Autor: Josué Solórzano
-- Fecha de creación: 10/10/2024
-- Descripción: Función almacenada que devuelve el total de obras de un artista.
-- =============================================
if object_id('dbo.fnTotalObrasArtista', 'FN') is not null
    drop function dbo.fnTotalObrasArtista;
go

create function dbo.fnTotalObrasArtista(@artistaId bigint)
returns int
as
begin
    declare @total int;
    
    select @total = count(*)
    from dbo.obras
    where idArtista = @artistaId;
    
    return @total;
end;
go


-- Funciones de tabla de varias instrucciones ----------------------------------------------------------

-- =============================================
-- Autor: Josué Solórzano
-- Fecha de creación: 10/10/2024
-- Descripción: Función almacenada que devuelve los talleres activos según la fecha actual
-- =============================================
if object_id('fnTalleresActivos', 'TF') is not null
    drop function fn_talleresActivos;
go

create function dbo.fnTalleresActivos()
returns @talleresActivos table
(
    id bigint,
    fechaInicio date,
    fechaFin date
)
begin
    insert into @talleresActivos
    select idTaller, fechaInicio, fechaFinal
    from dbo.ofertas 
    where fechaFinal >= getdate();
    return;
end;
go


-- =============================================
-- Autor: Alejandro Chaves
-- Fecha de creación: 10/10/2024
-- Descripción: Función almacenada que devuelve las facturas en un rango de fechas
-- =============================================
if object_id('fnFacturasPorFecha', 'TF') is not null
    drop function dbo.fnFacturasPorFecha;
go

create function fnFacturasPorFecha
(@fechaInicio date, @fechaFin date)
returns @facturas table
(
    id bigint,
    cliente_id bigint,
    total decimal(10, 2),
    fecha date
)
as
begin
    insert into @facturas
    select id, idUsuario, total, fecha
    from dbo.facturas
    where fecha between @fechaInicio and @fechaFin;
    return;
end;
go
