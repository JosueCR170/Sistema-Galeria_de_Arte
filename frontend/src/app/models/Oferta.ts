export class Oferta{
    constructor(
        public id:number,
        public idTaller:number,
        public fechaInicio:string,
        public fechaFinal:string,
        public horaInicio:string,
        public horaFinal:string,
        public ubicacion:string,
        public modalidad:string,
        public cupos: number
    ){}
}