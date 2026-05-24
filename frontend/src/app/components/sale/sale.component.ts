import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Obra } from '../../models/Obra';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Envio } from '../../models/Envio';
import { Factura } from '../../models/Factura';
import { FacturaService } from '../../services/factura.service';
import { EnvioService } from '../../services/envio.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { server } from '../../services/global';
import { DetalleFactura } from '../../models/DetalleFactura';
import { DetalleFacturaService } from '../../services/detalleFactura.service';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [RouterLink, FormsModule,CommonModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

  public shippingCost: string = '';
  public totalCost: string = '';
  public obras: Obra[] = [];
  public status: number;
  public envio:Envio;
  public factura:Factura;
  public detallesFactura:DetalleFactura;

  public errors:string[]=[];
  public currentDate = new Date();
  urlAPI:string;
//Formateamos la fecha en formato YYYY-MM-DD
public formattedDate = this.formatDate(this.currentDate);

  constructor(
    private _obraService: ObraService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private _userService: UserService,
    private _facturaService: FacturaService,
    private _envioService: EnvioService,
    private _detallesFacturaService:DetalleFacturaService,
    private _artistService:ArtistService
    

  ) {
    this.status = -1;
    this.urlAPI = server.url+'obra/getimage/';
    this.envio=new Envio(1,0,"On hold","","","","","","");
    this.factura=new Factura(1,1,this.formattedDate,null);
    this.detallesFactura=new DetalleFactura(0,null,null,null);
  }
  user: any;
  artista:any;
  selectedOption: string = '';

  isOptionSelected(): boolean {
    return this.selectedOption !== 'Select the method of receiving the product';
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Agrega un cero al mes si es necesario
    const day = date.getDate(); // Agrega un cero al día si es necesario
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.loadLoggedUser();
    if(this.user == null){
      this.msgAlert('debe iniciar sesion',' ','error');
      this._router.navigate(['/login']);
    }else{
    const id = this._routes.snapshot.paramMap.get('id');
    const artistId = this._routes.snapshot.paramMap.get('artistId');
  
    if (id) {
      this.getObra(id);
    }else{
      this.getObrasCarrito(artistId)
      if (artistId !== null) {
        this.getArtist(this.parseInt(artistId));
      }
    }
    }
    
  }

  getArtist(artistId: number) {
    this._artistService.showArtist(artistId).subscribe({
      next:(response)=>{
        this.artista = response.Artista;
      },
      error:(error)=>{
        console.log('Error al obtener el artista:', error);
      }
    });
      
  }

getObrasCarrito(artistId:any):void
{
  const carrito= sessionStorage.getItem('obrasCarrito');
  this.obras=carrito? JSON.parse(carrito):[];
  this.obras = Array.isArray( this.obras) ?  this.obras : [];
  this.obras.forEach(o => {if(typeof o.idArtista==='string'){o.idArtista=this.parseInt(o.idArtista)}
  });
  this.obras = this.obras.filter(obra => obra.idArtista == artistId);


}

//METODO PARA CREAR LAS FACTURAS DE LAS OBRAS
// createFacturas(){this.obras.forEach(o => {this.facturas.push(new Factura(1,this.user['iss'],o.id,this.formattedDate,0,0,0));});}


  getObra(id: string): void {
       this._obraService.getArtworkById(id).subscribe(
         data => {
        this.obras.push(data['obra']);
        this.artista=data['obra'].artista;
        this.status = 1;
      },
      error => {
        console.error('Error al obtener la obra:', error);
        this.status = 0;
      }
    );
  }

  logOut(){
    sessionStorage.clear();
    this._router.navigate([''])
  }  
  
  loadLoggedUser(){
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);

  }


  
  loadAdmin(){
    this._router.navigate(['/admin'])
    }

  updateShippingMethod(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    let total=0;
    
    this.obras.forEach(o => {
      if(typeof o.precio==='string'){
        o.precio=parseFloat(o.precio);
      }
      total=total+ o.precio;});

    if (selectedValue === 'Home delivery') {
      this.shippingCost = '3.000';
      this.factura.total=total+3000;

      this.totalCost = (total+3000).toString();
    } else if (selectedValue === 'Product recall') {
    
      this.shippingCost = 'Free';
      this.factura.total=total
      this.totalCost = total.toString();
    } else {
      this.shippingCost = '';
      this.totalCost = total.toString();
    }

  }
  
   eliminarObrasCompradasCarrito() {
    let obrasCarrito = JSON.parse(sessionStorage.getItem('obrasCarrito') || '[]');
    let obrasRestantes = obrasCarrito.filter((obra: any) => 
      !this.obras.some((comprada: any) => comprada.id === obra.id)
    );
    sessionStorage.setItem('obrasCarrito', JSON.stringify(obrasRestantes));
  }

  onSubmit(form: any) {
    let flag = true;
    this.obras.forEach(o => {
      if(typeof o.disponibilidad==='string'){o.disponibilidad = o.disponibilidad === '1' || o.disponibilidad === 1;}
    

      if (!o.disponibilidad) {
        flag = false;
      }
    });
  
    if (flag) {
      let respuesta: any;
      this.factura.idUsuario = this.user['iss'];

      this._facturaService.create(this.factura).subscribe({
        next: (facturaResponse) => {  
        respuesta = facturaResponse;  
          if (respuesta.status === 201) {
            this.envio.idFactura = respuesta.factura['id'];
  
            try {
              this.envioCreate();
  
              this.obras.forEach(o => {
                this.detallesFactura.idFactura = parseInt(respuesta.factura['id']);
                this.detallesFactura.idObra = o.id;
                if (typeof o.precio === 'string') {
                  this.detallesFactura.subtotal = parseFloat(o.precio);
              }
                else{this.detallesFactura.subtotal =o.precio;} 
                this.detallesFacturaCreate();
              });
            } catch (err) {
              console.log(err);
            }

            this.eliminarObrasCompradasCarrito()
            sessionStorage.removeItem("comprarObras");
            this.obras=[];
            form.reset();
           // this._router.navigate(['/shop'])
            //this.msgAlert('Factura registrada con éxito', '', 'success');
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 406 && error.error && error.error.errors) {
            this.errors = [];
            const errorObj = error.error.errors;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errors.push(...errorObj[key]);
              }
            }
            console.error(this.errors);
          } else {
            console.error('Otro tipo de error:', error);
            this.msgAlert('Error desde el servidor. Contacta al administrador', '', 'error');
          }
        }
      });
    } else {
      this.msgAlert('Obra no disponible', '', 'error');
    }
  }
  

  envioCreate(){
    this._envioService.create(this.envio).subscribe({
      next:(envioResponse)=>{
        if(envioResponse.status==201){

        var mensaje = `Take screenshot<br>
            <p>Contact the author <strong>${this.artista['nombreArtista']}</strong> to make the payment</p>
            <p>Artist phone: <strong>${this.artista['telefono']}</strong> </p>
            <p>Artist email: <strong>${this.artista['correo']}</strong></p>`

          this.msgAlertHTML('Shipment registered successfully',mensaje, 'success');
        }else{
          //this.changeStatus(1);
        }
      },
      error:(error:HttpErrorResponse)=>{
        if(error.status===406 && error.error && error.error.errors){
          this.errors=[];
          const errorObj = error.error.errors;
          for (const key in errorObj) {
            if (errorObj.hasOwnProperty(key)) {
              this.errors.push(...errorObj[key]);
            }
          }
          console.error(this.errors);
        } else {
          console.error('Otro tipo de error:', error);
          this.msgAlert('Error, from the server. Contact administrator','','error');
        }
        }
    })
  }

  detallesFacturaCreate(){
    this._detallesFacturaService.create(this.detallesFactura).subscribe({
      next:(detallesResponse)=>{
        if(detallesResponse.status==201){

          //this.msgAlert('detalles factura registered successfully','', 'success');
          this._router.navigate(['/shop'])
        }else{
          //this.changeStatus(1);
        }
      },
      error:(error:HttpErrorResponse)=>{
        if(error.status===406 && error.error && error.error.errors){
          this.errors=[];
          const errorObj = error.error.errors;
          for (const key in errorObj) {
            if (errorObj.hasOwnProperty(key)) {
              this.errors.push(...errorObj[key]);
            }
          }
          console.error(this.errors);
        } else {
          console.error('Otro tipo de error:', error);
          this.msgAlert('Error, from the server. Contact administrator','','error');
        }
        }
    })
  }

  msgAlert(title: any, text: any, icon: any) {
    Swal.fire({
      title,
      text,
      icon,
    });
  }

  msgAlertHTML(title: any, html: any, icon: any)
  {
    Swal.fire({
      title,
      html,
      icon,
      confirmButtonText: 'OK'
    });
  }

  public parseInt(value: string){
    return parseInt(value, 10);
  }


}
