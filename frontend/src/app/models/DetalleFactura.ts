export class DetalleFactura{
    constructor(
        public id:number,
        public idFactura:number | null,
        public idObra:number | null,
        public subtotal:number | null
    ){}
}