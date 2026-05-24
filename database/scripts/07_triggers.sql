use galeria_db
go
--TRIGGERS de galeria_db

-- =============================================
-- Autor: Josué Solórzano
-- Fecha de Creación: 11/10/2024
-- Descripción:	Cambia la disponibilidad a no disponible cuando se agrega un detalle factura para que la obra no pueda ser comprada después
-- =============================================
create trigger disCambiarDisponibilidadObra
on detallesFactura for insert
as
	begin
		update obras set [disponibilidad]=0 where [id] = (select idObra from inserted) and [disponibilidad] <> 0
	end
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 11/10/2024
-- Descripción:	Verifica que la fecha final de la oferta sea mayor o igual a la fecha de inicio, es posible que una oferta esté disponible solo por un día
-- =============================================
create trigger disFechaOferta
on ofertas
for insert, update
as
begin
  if exists (select 1 from inserted where fechaFinal < fechaInicio)
  begin
    raiserror('La fecha final debe ser igual o después de la fecha de inicio.', 16, 1);
    rollback transaction;
  end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 11/10/2024
-- Descripción:	Verifica que el costo no sea un valor negativo
-- =============================================
create trigger disCostoObras
on obras
for insert, update
as
begin
  if exists (select 1 from inserted where precio < 0)
  begin
    raiserror('El precio no puede ser negativo en las obras.', 16, 1);
    rollback transaction;
  end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 18/10/2024
-- Descripción:	Verifica que los cupos no sea un valor negativo
-- =============================================
create trigger disCuposOferta
on ofertas
for insert, update
as
begin
  if exists (select 1 from inserted where cupos < 0)
  begin
    raiserror('Los cupos no puede ser negativo en las ofertas.', 16, 1);
    rollback transaction;
  end
end;
Go


-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 11/10/2024
-- Descripción:	Verifica que la fecha de registro sea igual o mayor a la fecha de creación
-- =============================================
create trigger disFechaRegistroObras
on obras
for insert, update
as
begin
  if exists (select 1 from inserted where fechaRegistro < fechaCreacion)
  begin
    raiserror('La fecha de registro debe ser igual o posterior a la fecha de creación en las obras.', 16, 1);
    rollback transaction;
  end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 11/10/2024
-- Descripción:	Verifica que el total de la factura no tenga un valor negativo
-- =============================================
create trigger disTotalFacturas
on facturas
for insert, update
as
begin
  if exists (select 1 from inserted where total < 0)
  begin
    raiserror('El total no puede ser negativo en las facturas.', 16, 1);
    rollback transaction;
  end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 11/10/2024
-- Descripción:	Verifica que la fecha del envío recibido sea mayor o igual a la fecha de envío
-- =============================================
create trigger disFechaEnvios
on envios
for insert, update
as
begin
  if exists (select 1 from inserted where fechaRecibido < fechaEnviado)
  begin
    raiserror('La fecha de recibido debe ser igual o después de la fecha de enviado.', 16, 1);
    rollback transaction;
  end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 11/10/2024
-- Descripción:	Verifica que el subtotal no sea un valor negativo
-- =============================================
create trigger disSubtotalDetalles
on detallesFactura
for insert, update
as
begin
  if exists (select 1 from inserted where subtotal < 0)
  begin
    raiserror('El subtotal no puede ser negativo en los detalles.', 16, 1);
    rollback transaction;
  end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 11/10/2024
-- Descripción:	Verifica que la duración sea mayor a cero y que el costo no sea un valor negativo
-- =============================================
create trigger disDuracionCostoTalleres
on talleres
for insert, update
as
begin
  if exists (select 1 from inserted where duracion <= 0)
  begin
    raiserror('La duración debe ser mayor que cero en los talleres.', 16, 1);
    rollback transaction;
  end
  
  if exists (select 1 from inserted where costo < 0)
  begin
    raiserror('El costo no puede ser negativo en los talleres.', 16, 1);
    rollback transaction;
  end
end;


