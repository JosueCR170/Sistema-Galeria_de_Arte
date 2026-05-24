-- =============================================
-- PROCEDIMIENTOS ALMACENADOS DE LA BASE DE DATOS GALERIA_DB
-- AUTORES: JOSUÉ SOLÓRZANO - ALEJANDRO CHAVES - DANIEL GONZÁLEZ - RANDY VILLARREAL
-- =============================================
use galeria_db
go

-- =======================================================
--		PROCEDIMIENTOS ALMACENADOS DE LA TABLA "detallesFactura"
-- =======================================================

-- =============================================
-- Autor: Randy villarreal, paInsertarDetallesFactura
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite agregar un nuevo detalleFactura
-- =============================================
if object_id('dbo.paInsertarDetallesFactura', 'p') is not null
    drop procedure dbo.paInsertarDetallesFactura;
go

create procedure paInsertarDetallesFactura
    @idFactura bigint,
    @idObra bigint,
    @subtotal float
as
begin
    begin try
        begin transaction;
        if not exists (select 1 from facturas where id = @idFactura)
        begin
            raiserror('La factura especificada no existe.', 16, 1);
            rollback transaction;
            return;
        end

        if not exists (select 1 from obras where id = @idObra)
        begin
            raiserror('La obra de arte especificada no existe.', 16, 1);
            rollback transaction;
            return;
        end

        insert into detallesFactura ([idFactura], [idObra], [subtotal])
        values (@idFactura, @idObra, @subtotal);
        
        commit transaction;
    end try
    begin catch
        rollback transaction;
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
    end catch
end;
go

-- =======================================================
--		PROCEDIMIENTOS ALMACENADOS DE LA TABLA "facturas"
-- =======================================================

-- =============================================
-- Autor: Josué Solórzano, paInsertarFactura
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite agregar una nueva factura
-- =============================================
if object_id('dbo.paInsertarFactura', 'p') is not null
    drop procedure dbo.paInsertarFactura;
go

create procedure paInsertarFactura
    @idUsuario bigint,
    @fecha date,
    @total float
as
begin
    begin try
        begin transaction;

        if not exists (select 1 from users where id = @idUsuario)
        begin
            raiserror('El usuario especificado no existe.', 16, 1);
            rollback transaction;
            return;
        end

        insert into dbo.facturas (idUsuario, fecha, total, created_at)
        values (@idUsuario, @fecha, @total, getdate());

        commit transaction;
    end try
    begin catch
        rollback transaction;
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
    end catch
end;
go

-- =======================================================
--		PROCEDIMIENTOS ALMACENADOS DE LA TABLA "matriculas"
-- =======================================================

-- =============================================
-- Autor: Randy Villarreal, paInsertarMatricula
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite agregar una nueva matricula
-- =============================================
if object_id('dbo.paInsertarMatricula', 'p') is not null
    drop procedure dbo.paInsertarMatricula;
go

create procedure [dbo].[paInsertarMatricula]
    @idUsuario bigint,
    @idOferta bigint,
    @costo float,
    @fechaMatricula date
as
begin
    begin try
        begin transaction;

        if not exists (select 1 from users where id = @idUsuario)
        begin
            raiserror('El usuario especificado no existe.', 16, 1);
            rollback transaction;
            return;
        end

        if not exists (
            select 1 
            from ofertas with (updlock, rowlock)
            where id = @idOferta 
            and cupos > 0
        )
        begin
            raiserror('No hay cupos disponibles para la oferta especificada.', 16, 1);
            rollback transaction;
            return;
        end

        insert into matriculas (idUsuario, idOferta, costo, fechaMatricula, created_at)
        values (@idUsuario, @idOferta, @costo, @fechaMatricula, getdate());

        update ofertas
        set cupos = cupos - 1
        where id = @idOferta;
        commit transaction;
    end try
    begin catch
        rollback transaction;
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
    end catch
end;


go


-- =============================================
-- Autor: Randy Villarreal, paBuscarMatricula
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite buscar una matricula por su id
-- =============================================
if object_id('dbo.paBuscarMatricula', 'p') is not null
    drop procedure dbo.paBuscarMatricula;
go

create procedure paBuscarMatricula
    @id bigint
as
begin
    begin try
        select * from matriculas where id = @id;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
    end catch
end;
go


-- =============================================
-- Autor: Randy Villarreal, paEliminarMatricula
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite eliminar una matricula por su id
-- =============================================
if object_id('dbo.paEliminarMatricula', 'p') is not null
    drop procedure dbo.paEliminarMatricula;
go

create procedure paEliminarMatricula
    @id bigint
as
begin
    begin try
        begin transaction;

        if not exists (select * from matriculas where id = @id)
        begin
            raiserror('La matricula con el id especificado no existe.', 16, 1);
            return;
        end

        delete from matriculas where id = @id;
        commit transaction;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
        rollback transaction;
    end catch
end;
go


-- =============================================
-- Autor: Randy Villarreal, paActualizarMatricula
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite actualizar una matricula por su id
-- =============================================
if object_id('dbo.paActualizarMatricula', 'p') is not null
    drop procedure dbo.paActualizarMatricula;
go

create procedure paActualizarMatricula 
    @id bigint,
    @idUsuario bigint,
    @idOferta bigint,
	@costo float,
    @fechaMatricula date
as 
begin
    begin try
        begin transaction;

        if not exists (select * from matriculas where id = @id)
        begin
            raiserror('La matricula con el id especificado no existe.', 16, 1);
            return;
        end

        if not exists (select 1 from users where id = @idUsuario)
        begin
            raiserror('El usuario especificado no existe.', 16, 1);
            return;
        end

        if not exists (select 1 from ofertas where id = @idOferta)
        begin
            raiserror('La oferta especificada no existe.', 16, 1);
            return;
        end

        update matriculas set  
            idUsuario = @idUsuario,
            idOferta = @idOferta,
			costo = @costo,
            fechaMatricula = @fechaMatricula,
            updated_at = getdate()
        where id = @id;

        commit transaction;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
        rollback transaction;
    end catch
end;
go

-- =======================================================
--		PROCEDIMIENTOS ALMACENADOS DE LA TABLA "ofertas"
-- =======================================================
-- =============================================
-- Autor: Alejandro Chaves, paInsertarOferta
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite agregar una nueva oferta
-- =============================================
if object_id('dbo.paInsertarOferta', 'p') is not null
    drop procedure dbo.paInsertarOferta;
go

create procedure paInsertarOferta
(
    @idTaller bigint,
    @fechaInicio date,
    @fechaFinal date,
	@horaInicio time,
	@horaFinal time,
    @ubicacion varchar(255),
    @modalidad varchar(20),
	@cupos tinyint
)
as
begin
    begin try
        begin transaction;

        if not exists (select 1 from talleres where id = @idTaller)
        begin
            raiserror('El taller especificado no existe.', 16, 1);
            rollback transaction;
            return;
        end

        insert into ofertas (idTaller, fechaInicio, fechaFinal, horaInicio, horaFinal, ubicacion, modalidad, created_at, cupos)
        values (@idTaller, @fechaInicio, @fechaFinal, @horaInicio, @horaFinal, @ubicacion, @modalidad, getdate(), @cupos);

        commit transaction;
    end try
    begin catch
        rollback transaction;
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
    end catch
end;
go


-- =============================================
-- Autor: Alejandro Chaves, paBuscarOferta
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite buscar una oferta por su id
-- =============================================
if object_id('dbo.paBuscarOferta', 'p') is not null
    drop procedure dbo.paBuscarOferta;
go

create procedure paBuscarOferta
(
    @id bigint
)
as
begin
    begin try
        select * from ofertas where id = @id;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
    end catch
end;
go


-- =============================================
-- Autor: Alejandro Chaves, paEliminarOferta
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite eliminar una oferta por su id
-- =============================================
if object_id('dbo.paEliminarOferta', 'p') is not null
    drop procedure dbo.paEliminarOferta;
go

create procedure paEliminarOferta
(
    @id bigint
)
as
begin
    begin try
        begin transaction;

        if not exists (select * from ofertas where id = @id)
        begin
            raiserror('La oferta con el id especificado no existe.', 16, 1);
            return;
        end

        delete from ofertas where id = @id;
        commit transaction;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
        rollback transaction;
    end catch
end;
go


-- =============================================
-- Autor: Alejandro Chaves, paActualizarOferta
-- Fecha de creación: 04/09/2024
-- Descripción: Procedimiento almacenado que permite actualizar una oferta por su id
-- =============================================
if object_id('dbo.paActualizarOferta', 'p') is not null
    drop procedure dbo.paActualizarOferta;
go

create procedure paActualizarOferta
(
    @id bigint,
    @idTaller bigint,
    @fechaInicio date,
    @fechaFinal date,
	@horaInicio time,
	@horaFinal time,
    @ubicacion varchar(255),
    @modalidad varchar(20),
	@cupos tinyint
)
as
begin
    begin try
        begin transaction;

        if not exists (select * from ofertas where id = @id)
        begin
            raiserror('La oferta con el id especificado no existe.', 16, 1);
            return;
        end

        if not exists (select 1 from talleres where id = @idTaller)
        begin
            raiserror('El taller especificado no existe.', 16, 1);
            return;
        end

        update ofertas
        set idTaller = @idTaller,
            fechaInicio = @fechaInicio,
            fechaFinal = @fechaFinal,
			horaInicio = @horaInicio,
			horaFinal = @horaFinal,
            ubicacion = @ubicacion,
            modalidad = @modalidad,
            updated_at = getdate(),
			cupos=@cupos
        where id = @id;

        commit transaction;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
        rollback transaction;
    end catch
end;
go



-- =======================================================
--		PROCEDIMIENTOS ALMACENADOS DE LA TABLA "talleres"
-- =======================================================

-- =============================================
-- Autor: Daniel González, paInsertarTaller
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite agregar un nuevo taller
-- =============================================
if exists (select 1 from sys.objects where object_id = object_id(N'[dbo].[paInsertarTaller]') and type in (N'P', N'PC'))
begin
    drop procedure [dbo].[paInsertarTaller];
end
go

create procedure [dbo].[paInsertarTaller]
	@idArtista bigint, 
    @nombre varchar(50), 
    @descripcion varchar(255),
    @duracion float,
    @costo float,
	@categoria varchar(25)
as
begin
    begin try
        begin transaction;
        if exists (select 1 from dbo.talleres where nombre = @nombre)
        begin
            raiserror('El nombre del taller ya existe.', 16, 1);
            rollback transaction;
            return;
        end
        insert into dbo.talleres (idArtista,nombre, descripcion, duracion, costo, categoria, created_at)
        values (@idArtista,@nombre, @descripcion, @duracion, @costo, @categoria, getdate());
        commit transaction;
    end try
    begin catch
        rollback transaction;
        declare @ErrorMessage nvarchar(1000) = error_message();
        declare @ErrorSeverity int = error_severity();
        declare @ErrorState int = error_state();

        raiserror(@ErrorMessage, @ErrorSeverity, @ErrorState);
    end catch
end;
go


-- =============================================
-- Autor: Daniel González, paBuscarTaller
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite buscar un taller por su id
-- =============================================
if exists (select 1 from sys.objects where object_id = object_id(N'[dbo].[paBuscarTaller]') and type in (N'P', N'PC'))
begin
    drop procedure [dbo].[paBuscarTaller];
end
go

create procedure [dbo].[paBuscarTaller]
    @id int
as
begin
    begin try
        select * from dbo.talleres where id = @id;
    end try
    begin catch
        declare @ErrorMessage nvarchar(1000) = error_message();
        declare @ErrorSeverity int = error_severity();
        declare @ErrorState int = error_state();
        
        raiserror(@ErrorMessage, @ErrorSeverity, @ErrorState);
    end catch
end;
go


-- =============================================
-- Autor: Daniel González, paEliminarTaller
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite eliminar un taller por su id
-- =============================================
if exists (select 1 from sys.objects where object_id = object_id(N'[dbo].[paEliminarTaller]') and type in (N'P', N'PC'))
begin
    drop procedure [dbo].[paEliminarTaller];
end
go

create procedure [dbo].[paEliminarTaller]
    @id int
as
begin
    begin try
        begin transaction;
        if not exists (select * from dbo.talleres where id = @id)
        begin
            raiserror('El taller con el id especificado no existe.', 16, 1);
            rollback transaction;
            return;
        end
        delete from dbo.talleres where id = @id;
        commit transaction;
    end try
    begin catch
        declare @ErrorMessage nvarchar(1000) = error_message();
        declare @ErrorSeverity int = error_severity();
        declare @ErrorState int = error_state();
        
        raiserror(@ErrorMessage, @ErrorSeverity, @ErrorState);
        rollback transaction;
    end catch
end;
go


-- =============================================
-- Autor: Daniel González, paActualizarTaller
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite actualizar un taller por su id
-- =============================================
if exists (select 1 from sys.objects where object_id = object_id(N'[dbo].[paActualizarTaller]') and type in (N'P', N'PC'))
begin
    drop procedure [dbo].[paActualizarTaller];
end
go

create procedure [dbo].[paActualizarTaller]
    @id int,
    @nombre varchar(50),  
    @descripcion varchar(255),
    @duracion float,
    @costo float,
	@categoria varchar(25)
as
begin
    begin try
        begin transaction;
        if not exists (select * from dbo.talleres where id = @id)
        begin
            raiserror('El taller con el id especificado no existe.', 16, 1);
            rollback transaction;
            return;
        end
        if exists (select 1 from dbo.talleres where nombre = @nombre and id <> @id)
        begin
            raiserror('El nombre del taller ya está en uso.', 16, 1);
            rollback transaction;
            return;
        end
        update dbo.talleres
        set 
            nombre = @nombre,
            descripcion = @descripcion,
            duracion = @duracion,
            costo = @costo,
			categoria = @categoria,
            updated_at = getdate()
        where id = @id;
        commit transaction;
    end try
    begin catch
        declare @ErrorMessage nvarchar(1000) = error_message();
        declare @ErrorSeverity int = error_severity();
        declare @ErrorState int = error_state();

        raiserror(@ErrorMessage, @ErrorSeverity, @ErrorState);
        rollback transaction;
    end catch
end;
go


-- =======================================================
--		PROCEDIMIENTOS ALMACENADOS DE LA TABLA "users"
-- =======================================================

-- =============================================
-- Autor: Josué Solórzano, paInsertarUsuario
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite agregar nuevos usuarios
-- =============================================
if object_id('dbo.paInsertarUsuario', 'p') is not null
    drop procedure dbo.paInsertarUsuario;
go

create procedure paInsertarUsuario
    @nombre varchar(80),
    @password varchar(100),
    @telefono int,
    @email varchar(45),
    @tipoUsuario tinyint,
    @nombreUsuario nvarchar(30)
as
begin
    begin try
        begin transaction;
        if exists (select 1 from dbo.users where nombreUsuario = @nombreUsuario)
        begin
            raiserror('El nombre de usuario ya existe.', 16, 1);
            rollback transaction;
            return;
        end

        if exists (select 1 from dbo.users where email = @email)
        begin
            raiserror('El correo electrónico ya está registrado.', 16, 1);
            rollback transaction;
            return;
        end

        insert into dbo.users (nombre, password, telefono, email, tipoUsuario, nombreUsuario, created_at)
        values (@nombre, @password, @telefono, @email, @tipoUsuario, @nombreUsuario, getdate());
        commit transaction;

    end try
    begin catch
        rollback transaction;
        declare @ErrorMessage nvarchar(1000) = error_message();
        declare @ErrorSeverity int = error_severity();
        declare @ErrorState int = error_state();

        raiserror(@ErrorMessage, @ErrorSeverity, @ErrorState);
    end catch
end;

go


-- =============================================
-- Autor: Josué Solórzano, paBuscarUsuario
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite buscar un usuario por su id
-- =============================================
if object_id('dbo.paBuscarUsuario', 'p') is not null
    drop procedure dbo.paBuscarUsuario;
go

create procedure paBuscarUsuario
    @id bigint
as
begin
    begin try
        select * from dbo.users where id = @id;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
    end catch
end;
go



-- =============================================
-- Autor: Josué Solórzano, paEliminarUsuario
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite eliminar un usuario por su id
-- =============================================
if object_id('dbo.paEliminarUsuario', 'p') is not null
    drop procedure dbo.paEliminarUsuario;
go

create procedure paEliminarUsuario
    @id bigint
as
begin
    begin try
		begin transaction;
			if not exists (select * from dbo.users where id = @id)
			begin
				raiserror('El usuario con el id especificado no existe.', 16, 1);
				return;
			end

			delete from dbo.users where id = @id;
			commit transaction;
		end try
		begin catch
			declare @errormessage nvarchar(1000) = error_message();
			declare @errorseverity int = error_severity();
			declare @errorstate int = error_state();
			raiserror(@errormessage, @errorseverity, @errorstate);
			rollback transaction;
		end catch
end;
go



-- =============================================
-- Autor: Josué Solórzano, paActualizarUsuario
-- Fecha de Creación: 04/09/2024
-- Descripción:	Procedimiento almacenado que permite actualizar un usuario por su id
-- =============================================
if object_id('dbo.paActualizarUsuario', 'p') is not null
    drop procedure dbo.paActualizarUsuario;
go

create procedure paActualizarUsuario
    @id bigint,
    @nombre varchar(80),
    @password varchar(100),
    @telefono int,
    @email varchar(45),
    @tipoUsuario tinyint,
    @nombreUsuario nvarchar(30)
as
begin
    begin try
		begin transaction;
        if not exists (select * from dbo.users where id = @id)
        begin
            raiserror('El usuario con el id especificado no existe.', 16, 1);
            return;
        end

        if exists (select 1 from dbo.users where nombreUsuario = @nombreUsuario and id <> @id)
        begin
            raiserror('El nombre de usuario ya está en uso.', 16, 1);
            return;
        end

        if exists (select 1 from dbo.users where email = @email and id <> @id)
        begin
            raiserror('El correo electrónico ya está registrado.', 16, 1);
            return;
        end

        update dbo.users 
        set 
            nombre = @nombre,
            password = @password,
            telefono = @telefono,
            email = @email,
            tipoUsuario = @tipoUsuario,
            nombreUsuario = @nombreUsuario,
            updated_at = getdate()
        where id = @id;
		commit transaction;
    end try
    begin catch
        declare @errormessage nvarchar(1000) = error_message();
        declare @errorseverity int = error_severity();
        declare @errorstate int = error_state();
        raiserror(@errormessage, @errorseverity, @errorstate);
		rollback transaction;
    end catch
end;
go

-- =======================================================
--		PROCEDIMIENTOS ALMACENADOS DE BACKUP Y RESTORE PARA LA BASE DE DATOS
-- =======================================================

-- =============================================
-- Autor: Josué Solórzano, paBackupGaleriaDB
-- Fecha de Creación: 19/10/2024
-- Descripción:	Procedimiento almacenado que permite crear un nuevo backup
-- =============================================
if object_id('dbo.paBackupGaleriaDB', 'p') is not null
    drop procedure dbo.paBackupGaleriaDB;
go

CREATE PROCEDURE paBackupGaleriaDB
    @backupPath NVARCHAR(260)
AS
BEGIN
  SET NOCOUNT ON;
    DECLARE @backupFile NVARCHAR(500);
    SET @backupFile = @backupPath + '\galeria_db_Backup_' + 
                      FORMAT(GETDATE(), 'yyyyMMdd_HHmmss') + '.bak'; 

    BEGIN TRY
        BACKUP DATABASE [galeria_db] 
        TO DISK = @backupFile 
        WITH NOFORMAT, INIT,  
        NAME = N'galeria_db-Full Database Backup', 
        SKIP, NOREWIND, NOUNLOAD, STATS = 10;
       SELECT @backupFile AS BackupFile;
    END TRY
    BEGIN CATCH
        SELECT 'Error al realizar el backup: ' + ERROR_MESSAGE() AS Message;
    END CATCH
END
GO

-- Ejecución: EXEC paBackupGaleriaDB @backupPath = 'C:\SQLBackups';



