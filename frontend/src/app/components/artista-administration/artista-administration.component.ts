import { Component, OnInit } from '@angular/core';
import { ObraService } from '../../services/obra.service';
import { TallerService} from '../../services/taller.service';
import { Obra } from '../../models/Obra';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import Swal from 'sweetalert2';
import { server } from '../../services/global';
import { FacturaService } from '../../services/factura.service';
import { Factura } from '../../models/Factura';
import { Router, RouterLink } from '@angular/router';
import { Envio } from '../../models/Envio';
import { Pedido } from '../../models/Pedido';
import { EnvioService } from '../../services/envio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { DetalleFacturaService } from '../../services/detalleFactura.service';
import { Taller } from '../../models/Taller';
import { Oferta } from '../../models/Oferta';
import { OfertaService } from '../../services/oferta.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-artista-administration',
  standalone: true,
  imports: [TableModule, ConfirmDialogModule, ToastModule, ToolbarModule, CommonModule, DialogModule, FormsModule, TagModule, DropdownModule, ButtonModule, RippleModule],
  templateUrl: './artista-administration.component.html',
  styleUrl: './artista-administration.component.css',
  providers: [MessageService, ObraService, ConfirmationService],

})
export class ArtistaAdministrationComponent {
  public currentDate = new Date();
  errors:string[]=[];
  productDialog: boolean = false;
  selectedObras!: Obra[];
  submitted: boolean = false;
  statuses!: any[];
  selectAll: boolean = false;
  selectedObra!: Obra[];
  totalRecords!: number;
  clonedProducts: { [s: string]: Obra } = {};
  editing: boolean = false;
  /*-------*/
  displayConfirmationDialog: boolean = false;

  delivry: boolean = false;
  administration: boolean = true;
  tallerClick: boolean = false;
  offerClick: boolean = false;

  obras: Obra[] = [];
  facturasArtist: Factura[] = [];
  enviosArtist: Envio[] = [];
  selectedPedidos!: Pedido[];

  pedidosArtist: Pedido[] = [];

  fechaSeleccionada: string = '';
  ano: number | null = null;
  mes: string | null = null;
  dia: string | null = null;

  obrasPorArtista: Obra[] = [];
  public status: number;
  public obra: Obra;
  public pedido: Pedido;
  artist: any;
  selectedFile: File | null = null;
  urlAPI: string;

  /** Valriables y elementos de Talleres  */
  taller : any;
  tallerAux = new Taller (1,1, "", "", 1, 1,"");
  talleres: Taller[] = [];
  selectedTalleres!: Taller[];
  selectedTaller!: Taller[];
  public talleresList: { key: number, value: string }[] = [];
  public artistasList: { key: number, value: string }[] = [];

  /** Valriables y elementos de Ofertas  */
  oferta : any;
  ofertas: Oferta[] = [];
  selectedOfertas: Oferta[] = [];
  ofertaAux: Oferta = new Oferta(0, 0, "", "", "", "", "", "", 0);

  artStyles: string[] = [
    'Cubism', 'Impressionism', 'Expressionism', 'Realism', 'Surrealism', 'Abstract', 'Renaissance',
    'Baroque', 'Rococo', 'Romanticism', 'Neoclassicism', 'Modernism', 'Pop Art', 'Naïve Art'
  ]

  tecnicas: string[] = [
    'Oil on canvas', 'Watercolor', 'Watercolor on paper', 'Tempera', 'Pastel painting', 'Fresco painting',
    'Digital painting', 'Wood carving', 'Marble sculpture', 'Engraving', 'Serigraphy', 'Art photography',
    'Digital art', 'Collage', 'Pyrography', 'Bronze sculpture'
  ]

  categorias: string[] = ['3D', 'Photograph',  'Fashion', 'Art', 'UI-UX'];

  private checkIdentity;

  constructor(
    private obraService: ObraService,
    private messageService: MessageService,
    private facturaService: FacturaService,
    private detalleFacturaService:DetalleFacturaService,
    private envioService: EnvioService,
    private tallerService: TallerService,
    private ofertaService : OfertaService,
    private userService:UserService,
    private _router: Router,
  ) {
    this.status = -1;
    this.urlAPI = server.url + 'obra/getimage/';

    this.pedido = new Pedido(new Envio(1, 0, "On hold", "", "", "", "", "", ""),
      new Factura(0,null,"",0));
    this.obra = new Obra(1, 1, "", "", "", 0 , true, "", null, null, "");
    //this.taller = new Taller(1,"","",1,1);
    this.checkIdentity=setInterval(()=>{
      //this.identity=_userService.getIdentityFromStorage()

      this.verificarToken()
    },5000)
  }

  ngOnInit(): void {
    this.loadLoggedArtist();
    this.index();
    this.indexTalleres();
    this.indexOfertas();
    this.loadTallerName(); 
    this.getFacturasByArtist();

    this.indexEnvioByArtist();

  }

   //---------VERIFICAR TOKEN-----------------
   verificarToken() {
    this.userService.verifyToken().subscribe({
      next: (response: any) => {
        if (!response) {
          sessionStorage.clear();

          this._router.navigate(['']);
          //location.reload();
          this.msgAlert('Token caducado','Inicia sesión nuevamente','error');
        } else {
         this.artist = this.userService.getIdentityFromStorage();
       
        }
      },
      error: (err: Error) => {
        console.log('error del response',err);
      }
    });
  }

  logOut() {
    sessionStorage.clear();
    this._router.navigate([''])
  }

  redirectToArtistLogin() {
    this._router.navigate(['loginArtist'])
  }

  authTokenArtist() {
    let aux = sessionStorage.getItem('identity');
    if (aux == null) {
        return false;
    } else {
        let jason = JSON.parse(aux);
        if (!jason.nombreArtista) {
            return false;
        }
        return true;
    }
}
authTokenUserAdmin() {
  let aux = sessionStorage.getItem('identity');
  if (aux == null) {
    return false;
  } else {
    let jason = JSON.parse(aux);
    return jason.tipoUsuario;
  }
}


  reloadTablePedidos() {
    this.indexEnvioByArtist();
    this.selectedPedidos = [];
  }

  loadLoggedArtist() {
    this.artist = sessionStorage.getItem('identity');
    this.artist = JSON.parse(this.artist);
  }

  index() {
    this.obraService.getArtworkByArtistId(this.artist['iss']).subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.obras.forEach(o => {if(typeof o.disponibilidad==='string'){o.disponibilidad=o.disponibilidad==='1'||o.disponibilidad===1}
          
        });

      },
      error: (err: Error) => {
        console.error('Error al cargar las obras', err);
      }
    });
  }


  showHome(show: boolean) {
    this.delivry = false;
    this.administration = false;
    this.tallerClick = false; 
    this.offerClick = false;
  }
  showDelivery(show: boolean) {
    this.delivry = show;
    this.administration = false;
    this.tallerClick = false; 
    this.offerClick = false;
  }
  adminObras(show: boolean) {
    this.tallerClick = false; 
    this.offerClick = false;
    this.delivry = false;
    this.administration = show;
  }
  showTaller(all: boolean) {
    this.delivry = false;
    this.administration = false;
    this.tallerClick = true; 
    this.offerClick = false;
  }
  showOferta(all: boolean) {
    this.delivry = false;
    this.administration = false;
    this.tallerClick = false; 
    this.offerClick = true;
  }

  /************************* */

  openNew() {
    this.obra = new Obra(1, this.artist.iss, "", "", "", 0, true, "", "", null, null);
    this.submitted = false;
    this.productDialog = true;
  }


  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedObra = value;
  }

  showConfirmationDialog() {
    this.displayConfirmationDialog = true;
  }

  /**Parte del UPDATE Obra */
  selectedImageFile: File | null = null;

  selectCategoria(categoria: string) {
    this.obra.categoria = categoria;
  }

  selectTecnica(tecnica: string) {
    this.obra.tecnica = tecnica;
  }

  editObra(obra: Obra) {
    this.obra = { ...obra };
    this.productDialog = true;
    }

  editPedido(pedido: Pedido) {
    this.pedido = { ...pedido };
    this.productDialog = true;
  }

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateObra(filename: any) {
    if(!this.obra.disponibilidad){
      this.msgAlert('A sold work cannot be modified','','error');
      return
    }
    if (this.selectedFile) {
      this.obraService.updateImage(this.selectedFile, filename).subscribe({
        next: (response: any) => {

        },
        error: (err: Error) => {
          console.log(err.message);
        }
      });
    }
    this.obraService.update(this.obra).subscribe({
      next: (response: any) => {
        location.reload();
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }


  updatePedido(envio: Envio) {
    envio.id=this.selectedPedidos[0].envio.id;
    envio.idFactura=this.selectedPedidos[0].envio.idFactura;

    // envio.fechaEnviado=this.selectedPedidos[0].envio.fechaEnviado;
    // envio.fechaRecibido=this.selectedPedidos[0].envio.fechaRecibido;
    this.envioService.update(envio).subscribe({
      next: (response: any) => {

        this.msgAlert('Order updated successfully','','success');
        
        this.selectedPedidos = [];
       this.indexEnvioByArtist();

      },
      error: (err: Error) => {
        console.log(err);
        this.msgAlert('Error, from the server. Contact administrator','','error');
      }
    });
  }


  deleteImage(filename:string|null){

    if(filename==null){
      this.msgAlert('Imagen no eliminada, contiene null','','error');
      return;
    }

    this.obraService.destroyImage(filename).subscribe({
      next:(response:any)=>{
      },
      error:(error:any)=>{
        console.error(error);
       // this.msgAlert('Imagen no eliminada','','error');
      }
    });
  }
  /**Parte del DELETE Obra */
  deleteSelectedObras() {
    let allAvailable = true;

    this.selectedObras.forEach(obra => {
        if (!obra.disponibilidad) {
            allAvailable = false;
        }
    });

    if (!allAvailable) {
      this.selectedObras = [];
        this.msgAlert('Error when deleting artwork, check that they are not sold', '', 'error');
        return;
    }

    this.selectedObras.forEach(obra => {
     

      this.obraService.deleted(obra.id).subscribe({
        next: () => {

          this.deleteImage(obra.imagen);

          this.obras = this.obras.filter(o => o.id !== obra.id);
          this.totalRecords--;
          this.msgAlert('artwork successfully eliminated','','success');
        },
        error: (err: Error) => {
          console.error('Error al eliminar la obra', err);
          this.msgAlert('Error, from the server. Contact administrator','','error');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete obra: ${obra.nombre}`,
            life: 3000
          });
        }
      });
})
    
  ;

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Obras Deleted',
      life: 3000
    });

    this.selectedObras = [];
    this.displayConfirmationDialog = false;
  }

  hideConfirmationDialog() {
    this.displayConfirmationDialog = false;
  }

  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }

  storeImage(form: any) {
    if (form.valid) {
      if (this.selectedFile) {
        this.obraService.upLoadImage(this.selectedFile).subscribe({
          next: (response: any) => {

            if (response.filename) {
              this.obra.imagen = response.filename;
              this.obra.fechaRegistro = this.dateToString(new Date());
              this.obraService.create(this.obra).subscribe({
                next: (response2: any) => {
                  this.msgAlert('Saved artwork','','success');
                  this.index();
                },
                error: (error: any) => {
                  this.deleteImage(this.obra.imagen);

                  if (error.status === 500 && error.error && error.error.error) {
                    this.errors = [];
                    const errorObj = error.error.error;
                    if (errorObj.includes('La fecha de registro debe ser igual o posterior a la fecha de creación en las obras')) {
                      this.msgAlert('The registration date must be equal to or later than the creation date', '', 'error');
                    } else {
                      if (errorObj.includes('El precio no puede ser negativo en las obras')) {
                        this.msgAlert('The price cannot be negative in the artworks', '', 'error');
                      } else {
                    this.msgAlert('Error adding artwork', this.errors, 'error');
                  } }
                }else

                if (error.status === 406 && error.error && error.error.error) {
                  this.errors = [];
                  const errorObj = error.error.error;
                  for (const key in errorObj) {
                    if (errorObj.hasOwnProperty(key)) {
                      this.errors.push(...errorObj[key]);
                    }
                  }
                  this.msgAlert('Error adding artwork', this.errors, 'error');
                } 
                
                else {
                  //console.error('Other type of error:', error);
                  this.msgAlert('Error from the server, contact an administrator', '', 'error');
                }

              }

                
              });

            } else {
              console.error('No se recibió el nombre del archivo.');
            }
          },
          error: (err: any) => {
            console.error(err);
          }

          
        });
      }else{this.msgAlert('Error, file not chosen','','error');}
    }else{console.error('No se hizo nada');
      this.msgAlert('All data must be filled in','','error');
    }
  }



  indexEnvioByArtist() {
    this.envioService.indexByArtist().subscribe({
      next: (response: any) => {
        this.enviosArtist = response['data'];
        this.fillPedidos();
      },
      error: (err: Error) => {
        console.log('Error al cargar los envios del artista', err);
      }
    });
  }


  getFacturasByArtist() {


    this.facturaService.indexByArtistId(this.artist['iss']).subscribe({
      next: (response: any) => {
        this.facturasArtist = response['data'];

        this.fillPedidos();
      },
      error: (err: Error) => {
        console.error('Error al cargar las facturas', err);
      }
    });
  }

  fillPedidos() {
    this.pedidosArtist = [];
    for (let envio of this.enviosArtist) {
      if(typeof envio.idFactura ==='string'){envio.idFactura=parseInt(envio.idFactura)}
      let factura = this.facturasArtist.find(f => f.id === envio.idFactura);
      if (factura) {
        if(typeof factura.idUsuario ==='string'){factura.idUsuario=parseInt(factura.idUsuario)}
        let direccionCompleta = `${envio.direccion}, ${envio.provincia}, ${envio.ciudad}, Postal code: ${envio.codigoPostal}`;
        envio.direccion = direccionCompleta; // Agregar el atributo direcciónCompleta al envío
        let pedido = new Pedido(envio, factura);
          this.obraService.getArtworkByEnvioId(envio.id.toString()).subscribe({
            next: (response: any) => {
              let obrasEnvio=response['data']
             pedido.obras = obrasEnvio.map((obra: any) => obra);
             this.pedidosArtist.push(pedido);
            },
            error: (err: Error) => {
              console.error('Error al cargar las obras', err);
              pedido.obras= [];
              this.pedidosArtist.push(pedido);
            }
          });
      }
    }

  }

  dateToString(date: Date): string {
    this.ano = date.getFullYear();
    this.mes = ('0' + (date.getMonth() + 1)).slice(-2); // Mes se cuenta desde 0
    this.dia = ('0' + date.getDate()).slice(-2);
    return `${this.ano}-${this.mes}-${this.dia}`;
  }

  public formatDate(event:Event): string {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    this.ano = fecha.getFullYear();
    this.mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Mes se cuenta desde 0
    this.dia = ('0' + fecha.getDate()).slice(-2);
    return `${this.ano}-${this.mes}-${this.dia}`;
  }


  openNewPedido() {
    this.pedido = new Pedido(new Envio(1, 0, "On hold", "", "", "", "", "", ""),
    new Factura(0,null,"",0));
    this.submitted = false;
    this.productDialog = true;

  }


  updateDisponibilidadObra(obrita:Obra,disponibilidad:boolean){
    obrita.disponibilidad=disponibilidad;

    this.obraService.updateDisponibilidad(obrita).subscribe({
      next:(response)=>{
        if(response.status==201){
          this.msgAlert('Successfully updated availability','', 'success');
        }else{
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

  /****************** PARTE DE LOS TALLERES DE ARTISTAS  *************************/

  loadTallerName() {

    const artistId = this.artist['iss']
    if (artistId) {
        this.tallerService.getTalleresByArtist(Number(artistId)).subscribe({
            next: (response: any) => {
                let talleres = response['data'];
                this.talleresList = []; 
                talleres.forEach((e: any) => {
                    this.talleresList.push({
                        key: e.id,
                        value: e.nombre
                    });
                });
            },
            error: (err: Error) => {
                console.error('Error al buscar el taller', err);
            }
        });
    } else {
        console.error('No se encontró el ID del artista en la sesión');
    }
}


  openNewTaller() {
    this.tallerAux = new Taller(1, 1,"", "", 1, 1, "")
    this.submitted = false;
    this.productDialog = true;
  }
  openNewOferta() {
    this.ofertaAux = new Oferta(1,1,"","","","","","",1)
    this.submitted = false;
    this.productDialog = true;
  }

  editTaller(taller: Taller) {
    this.tallerAux = { ...taller };
    this.productDialog = true;
  }

  editOferta(oferta: Oferta) {
    this.ofertaAux = { ...oferta };
    this.productDialog = true;
  }

  indexTalleres() {
    this.tallerService.getTalleresByArtist(this.artist['iss']).subscribe({
      next: (response: any) => {

        this.talleres = response['data'];
      },
      error: (err: Error) => {
        console.error('Error al cargar los talleres', err);
      }
    });
  }
  
  indexOfertas() {
    this.ofertaService.indexFiltrado().subscribe({
      next: (response: any) => {

        this.ofertas = response['data'];
      },
      error: (err: Error) => {
        console.error('Error al cargar las ofertas filtradas', err);
      }
    });
  }

  updateTaller(): void {
    this.tallerService.update(this.tallerAux).subscribe({
      next: (response) => {
        this.msgAlert('Course updated successfully', '', 'success');
        this.indexTalleres();
        this.selectedTalleres = [];
      },
      error: (err: Error) => {
        this.msgAlert('Error updating course', '', 'error');
      }
    });
  }

  updateOferta(): void {
    if (this.ofertaAux.horaFinal  < this.ofertaAux.horaInicio) {
      this.msgAlert('The end time must be after to the start time.', '', 'error');
      return;
    }
    if (this.ofertaAux.fechaFinal < this.ofertaAux.fechaInicio) {
      this.msgAlert('The end date must be after or equal to the start date.', '', 'error');
      return;
    }
    this.ofertaService.update(this.ofertaAux).subscribe({
      next: (response) => {
        this.msgAlert('Offer updated successfully', '', 'success');
        this.indexOfertas();
        this.selectedOfertas = [];
      },
      error: (err: Error) => {
        this.msgAlert('Error updating offer', '', 'error');
        this.selectedOfertas = [];
      }
    });
  }

  storeTaller(form: any): void {
    if (form.valid) {
      this.tallerAux.idArtista = this.artist.iss;
      this.tallerService.create(this.tallerAux).subscribe({
        next: (response) => {
          if (response.status === 201) {
            form.reset();
            this.msgAlert('Course added successfully', '', 'success');
            this.indexTalleres();
          } else {
            console.error('Could not add the workshop.');
          }
        },
        error: (error: any) => {
          if (error.status === 406 && error.error && error.error.errors) {
            this.errors = [];
            const errorObj = error.error.errors;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errors.push(...errorObj[key]);
              }
            }
            this.msgAlert('Error adding course', this.errors, 'error');
          } else {
            console.error('Other error:', error);
            this.msgAlert('Server error, contact an administrator', '', 'error');
          }
        }
      });
    }
  }
  
  
  storeOferta(form: any): void {
    if (this.ofertaAux.cupos <= 0) {
      this.msgAlert('The number of seats must be greater than 0.', '', 'error');
      return;
    }
    if (form.valid) {
      if (this.ofertaAux.horaFinal < this.ofertaAux.horaInicio) {
        this.msgAlert('The end time must be after the start time.', '', 'error');
        return;
      }
      if (this.ofertaAux.fechaFinal < this.ofertaAux.fechaInicio) {
        this.msgAlert('The end date must be equal to or after the start date.', '', 'error');
        return;
      }
      this.ofertaService.create(this.ofertaAux).subscribe({
        next: (response) => {
          if (response.status === 201) {
            form.reset();
            this.msgAlert('Offer added successfully', '', 'success');
            this.indexOfertas();
          } else {
            console.error('Could not add the offer');
          }
        },
        error: (error: any) => {
          if (error.status === 406 && error.error && error.error.errors) {
            this.errors = [];
            const errorObj = error.error.errors;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errors.push(...errorObj[key]);
              }
            }
            this.msgAlert('Error adding offer', this.errors, 'error');
          } else {
            this.msgAlert('Server error, contact the administrator', '', 'error');
          }
        }
      });
    }
  }

  deleteSelectedTalleres(): void {
      for (const taller of this.selectedTalleres) {
        const hasOffers = this.ofertas.some(oferta => Number(oferta.idTaller) === taller.id);
        if (hasOffers) {
          this.msgAlert('Error, the course cannot be deleted because it has linked offers', '', 'error');
          this.selectedTalleres = [];
          this.displayConfirmationDialog = false;
          return;
        } else {
          console.log(`Taller ${taller.id} no tiene ofertas`); 
        }
      }
      this.selectedTalleres.forEach(taller => {
        this.tallerService.deleted(taller.id).subscribe({
          next: () => {
            this.talleres = this.talleres.filter(t => t.id !== taller.id);
            this.totalRecords--;
            this.msgAlert('Course deleted successfully', '', 'success');
            this.indexTalleres();
          },
          error: (err: Error) => {
            this.msgAlert('Error deleting course', '', 'error');
          }
        });
      });
      this.selectedTalleres = [];
      this.displayConfirmationDialog = false;
    }
  
  deleteSelectedOfertas(): void {
    this.selectedOfertas.forEach(oferta => {
      this.ofertaService.deleted(oferta.id).subscribe({
        next: () => {
          this.ofertas = this.ofertas.filter(o => o.id !== oferta.id);
          this.totalRecords--;
          this.msgAlert('Offer deleted', '', 'success');
          this.indexOfertas();
        },
        error: (err: Error) => {
          console.error('Error deleting offer', err);
          this.msgAlert('Error deleting offer', '', 'error');
        }
      });
    });
    this.selectedOfertas = [];
    this.displayConfirmationDialog = false;
  }

  isVirtual = false;  
  onModalidadChange(modalidad: string): void {
    this.isVirtual = modalidad === 'Online';
    if (this.isVirtual) {
      this.ofertaAux.ubicacion = '';
    }
  }


  onFechaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    this.ano = fecha.getFullYear();
    this.mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    this.dia = ('0' + fecha.getDate()).slice(-2);
    this.fechaSeleccionada = `${this.ano}-${this.mes}-${this.dia}`;
  }

}
