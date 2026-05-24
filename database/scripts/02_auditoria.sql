use galeria_db
go
-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 12/10/2024
-- Descripción:	Tabla para auditar los registros de 'users'
-- =============================================
create table dbo.usuariosAudit (
    auditId bigint identity(1,1) primary key,
    usuarioAfectado bigint not null,
    operacion varchar(10) not null,
    oldData nvarchar(max) null,
    newData nvarchar(max) null,
    timestamp datetime default getdate() not null,
    usuarioModifico nvarchar(50) not null,
   
    constraint CK_operacion_usuarios_audit CHECK (operacion in ('INSERT', 'UPDATE', 'DELETE'))
);


-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 12/10/2024
-- Descripción:	Tabla para auditar los registros de 'artista'
-- =============================================
create table dbo.artistasAudit (
    auditId bigint identity(1,1) primary key,
    artistaAfectado bigint not null,
    operacion varchar(10) not null,
    oldData nvarchar(max) null,
    newData nvarchar(max) null,
    timestamp datetime default getdate() not null,
    usuarioModifico nvarchar(50) not null,
   
    constraint CK_operacion_artistas_audit CHECK (operacion in ('INSERT', 'UPDATE', 'DELETE'))
);


-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 12/10/2024
-- Descripción:	Tabla para auditar los registros de 'obras'
-- =============================================
create table dbo.obrasAudit (
    auditId bigint identity(1,1) primary key,
    obraAfectada bigint not null,
    operacion varchar(10) not null,
    oldData nvarchar(max) null,
    newData nvarchar(max) null,
    timestamp datetime default getdate() not null,
    usuarioModifico nvarchar(50) not null,
   
    constraint CK_operacion_obras_audit CHECK (operacion in ('INSERT', 'UPDATE', 'DELETE'))
);


-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 12/10/2024
-- Descripción:	Trigger para auditar INSERT, UPDATE y DELETE en la tabla dbo.usuarios
-- =============================================
if exists (select * from sys.triggers where name = 'auditUsuarios')
drop trigger auditUsuarios;
go

create trigger auditUsuarios
on dbo.users
for insert, update, delete
as
begin
    if exists (select 1 from inserted) and not exists (select 1 from deleted)
    begin
        insert into dbo.usuariosAudit (usuarioAfectado, operacion, newData, timestamp, usuarioModifico)
        select i.id, 'INSERT', (select * from inserted for xml auto), getdate(), suser_sname()
        from inserted i;
    end

    if exists (select 1 from inserted) and exists (select 1 from deleted)
    begin
        insert into dbo.usuariosAudit (usuarioAfectado, operacion, oldData, newData, timestamp, usuarioModifico)
        select d.id, 'UPDATE', (select * from deleted for xml auto), (select * from inserted for xml auto), getdate(), suser_sname()
        from deleted d
        join inserted i on d.id = i.id;
    end

    if exists (select 1 from deleted) and not exists (select 1 from inserted)
    begin
        insert into dbo.usuariosAudit (usuarioAfectado, operacion, oldData, timestamp, usuarioModifico)
        select d.id, 'DELETE', (select * from deleted for xml auto), getdate(), suser_sname()
        from deleted d;
    end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 12/10/2024
-- Descripción:	Trigger para auditar INSERT, UPDATE y DELETE en la tabla dbo.artistas
-- =============================================
if exists (select * from sys.triggers where name = 'auditArtistas')
drop trigger auditArtistas;
go

create trigger auditArtistas
on dbo.artista
for insert, update, delete
as
begin
    if exists (select 1 from inserted) and not exists (select 1 from deleted)
    begin
        insert into dbo.artistasAudit (artistaAfectado, operacion, newData, timestamp, usuarioModifico)
        select i.id, 'INSERT', (select * from inserted for xml auto), getdate(), suser_sname()
        from inserted i;
    end
    if exists (select 1 from inserted) and exists (select 1 from deleted)
    begin
        insert into dbo.artistasAudit (artistaAfectado, operacion, oldData, newData, timestamp, usuarioModifico)
        select d.id, 'UPDATE', (select * from deleted for xml auto), (select * from inserted for xml auto), getdate(), suser_sname()
        from deleted d
        join inserted i on d.id = i.id;
    end
    if exists (select 1 from deleted) and not exists (select 1 from inserted)
    begin
        insert into dbo.artistasAudit (artistaAfectado, operacion, oldData, timestamp, usuarioModifico)
        select d.id, 'DELETE', (select * from deleted for xml auto), getdate(), suser_sname()
        from deleted d;
    end
end;
go

-- =============================================
-- Autor: Daniel González
-- Fecha de Creación: 12/10/2024
-- Descripción:	Trigger para auditar INSERT, UPDATE y DELETE en la tabla dbo.obras
-- =============================================
if exists (select * from sys.triggers where name = 'auditObras')
drop trigger auditObras;
go

create trigger auditObras
on dbo.obras
for insert, update, delete
as
begin
    if exists (select 1 from inserted) and not exists (select 1 from deleted)
    begin
        insert into dbo.obrasAudit (obraAfectada, operacion, newData, timestamp, usuarioModifico)
        select i.id, 'INSERT', (select * from inserted for xml auto), getdate(), suser_sname()
        from inserted i;
    end
    if exists (select 1 from inserted) and exists (select 1 from deleted)
    begin
        insert into dbo.obrasAudit (obraAfectada, operacion, oldData, newData, timestamp, usuarioModifico)
        select d.id, 'UPDATE', (select * from deleted for xml auto), (select * from inserted for xml auto), getdate(), suser_sname()
        from deleted d
        join inserted i on d.id = i.id;
    end
    if exists (select 1 from deleted) and not exists (select 1 from inserted)
    begin
        insert into dbo.obrasAudit (obraAfectada, operacion, oldData, timestamp, usuarioModifico)
        select d.id, 'DELETE', (select * from deleted for xml auto), getdate(), suser_sname()
        from deleted d;
    end
end;
go