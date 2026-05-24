export class Factura{
    constructor(
        public id:number,
        public idUsuario:number | null,
        public fecha:string | null,
        public total:number | null
    ){}
}