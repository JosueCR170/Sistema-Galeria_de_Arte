export class Obra{
    constructor(
        public id:number,
        public idArtista:number | null,
        public tecnica:string,
        public nombre:string,
        public tamano:string,
        public precio:number,
        public disponibilidad:boolean, 
        public categoria:string,
        public imagen:string | null,
        public fechaCreacion:string | null,
        public fechaRegistro:string | null
    ){}
}