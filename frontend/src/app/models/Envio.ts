export class Envio{
    constructor(
        public id:number,
        public idFactura:number,
        public estado:string,
        public direccion:string,
        public provincia:string,
        public ciudad:string,
        public codigoPostal:string,
        public fechaEnviado:string | null,
        public fechaRecibido:string | null,
    ){}
}