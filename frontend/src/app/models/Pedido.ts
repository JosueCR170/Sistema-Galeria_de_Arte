import { Envio } from "./Envio";
import { Factura } from "./Factura";
import { Obra } from "./Obra";

export class Pedido{
    constructor(
    public envio:Envio,
    public factura:Factura,
    public obras: Obra[] = []
    ){}
}