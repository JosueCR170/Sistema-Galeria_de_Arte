import { Component } from '@angular/core';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Obra } from '../../models/Obra';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../models/user';
import { Artista } from '../../models/Artista';
import { ArtistService } from '../../services/artist.service';
import { server } from '../../services/global';
import Swal from 'sweetalert2';
import { Taller } from '../../models/Taller';
import { TallerService } from '../../services/taller.service';
import { Oferta } from '../../models/Oferta';
import { OfertaService } from '../../services/oferta.service';
import { backupRestoreService } from '../../services/backupRestore.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, TableModule, ConfirmDialogModule, ToastModule, ToolbarModule, CommonModule, DialogModule, FormsModule, IconFieldModule, InputIconModule, TagModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [MessageService, ObraService, ConfirmationService],
})
export class AdminComponent {
  public artistasList: { key: number, value: string }[] = [];
  public talleresList: { key: number, value: string }[] = [];

  artStyles: string[] = [
    'Cubism', 'Impressionism', 'Expressionism', 'Realism', 'Surrealism', 'Abstract', 'Renaissance',
    'Baroque', 'Rococo', 'Romanticism', 'Neoclassicism', 'Modernism', 'Pop Art'
  ]

  tecnicas: string[] = [
    'Oil on canvas', 'Watercolor', 'Watercolor on paper', 'Tempera', 'Pastel painting', 'Fresco painting',
    'Digital painting', 'Wood carving', 'Marble sculpture', 'Engraving', 'Serigraphy', 'Art photography',
    'Digital art', 'Collage', 'Pyrography', 'Bronze sculpture'
  ]

  categorias: string[] = ['3D', 'Photograph',  'Fashion', 'Art', 'UI-UX']

  public status: number;
  public obra: Obra;
  public _user: User;
  public _artista: Artista;
  public _taller: Taller;
  public _oferta: Oferta;
  public currentDate = new Date();
  public formattedDate = this.formatDate(this.currentDate);
  public errores: string[] = [];
  public fechaSeleccionada: string = '';

  constructor(
    private _obraService: ObraService,
    private _userService: UserService,
    private _artistaService: ArtistService,
    private _tallerService: TallerService,
    private _ofertaService: OfertaService,
    private _backupRestoreService:backupRestoreService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private messageService: MessageService,
    
  ) {
    this.status = -1;
    this.urlAPI = server.url + 'obra/getimage/';
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
    this._user = new User(1, "", false, "", "", null, "");
    this._artista = new Artista(1, "", "", "", "", "");
    this._taller = new Taller(1,1,"","",1,1, "");
    this._oferta = new Oferta(1,1,"","","","","","",1);
  }

  totalRecords!: number;

  statuses!: any[];
  auxObras: Obra[] = [];
  categoryExists: string[] = [];

  clonedProducts: { [s: string]: Obra } = {};
  selectedCategory: string = '';
  selectAll: boolean = false;
  submitted: boolean = false;
  editing: boolean = false;
  displayConfirmationDialog: boolean = false;
  delivry: boolean = false;
  administration: boolean = false;
  productDialog: boolean = false;
  flag: boolean = true;
  userClick: boolean = false;
  artistClick: boolean = false;
  invoiceClick: boolean = false;
  shippingClick: boolean = false;
  workClick: boolean = false;
  tallerClick: boolean = false;
  offerClick: boolean = false;
  user: any;
  artist: any;
  urlAPI: string;
  selectedFile: File | null = null;


  obras: Obra[] = [];
  selectedObras!: Obra[];
  selectedObra!: Obra[];

  /** Variables y Elementos para la tabla de Users **/
  userAux = new User(1, "", false, "", "", null, "");
  users: User[] = [];
  selectedUsers: User[] = [];
  selectedUser: User[] = [];
  /** Variables y Elementos para la tabla de Artists **/
  artistaAux = new Artista(1, "", "", "", "", "");
  artistas: Artista[] = [];
  selectedArtistas: Artista[] = [];
  selectedArtista: Artista[] = [];
  /** Valriables y elementos de Talleres  */
  taller : any;
  tallerAux = new Taller (1,1, "", "", 1, 1,"");
  talleres: Taller[] = [];
  selectedTalleres!: Taller[];
  selectedTaller!: Taller[];

  /** Valriables y elementos de Ofertas  */
  oferta : any;
  ofertas: Oferta[] = [];
  selectedOfertas: Oferta[] = [];
  ofertaAux: Oferta = new Oferta(0, 0, "", "", "", "", "", "", 0);

  showHome(show: boolean) {
    this.flag = show;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
    this.tallerClick = false; 
    this.offerClick = false;
  }

  showUser(all: boolean) {
    this.flag = false;
    this.userClick = all;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
    this.tallerClick = false; 
    this.offerClick = false;
  }

  showArtist(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = all;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
    this.tallerClick = false; 
    this.offerClick = false;
  }
  showWork(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = true;
    this.tallerClick = false; 
    this.offerClick = false;
  }
  showTaller(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
    this.tallerClick = true; 
    this.offerClick = false;
  }
  showOferta(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
    this.tallerClick = false; 
    this.offerClick = true;
  }
  showInvoice(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = true;
    this.shippingClick = false;
    this.workClick = false;
    this.tallerClick = false; 
    this.offerClick = false;
  }
  showShipping(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = true;
    this.workClick = false;
    this.tallerClick = false; 
    this.offerClick = false;
  }
  adminObras(show: boolean) {
    this.flag = false;
    this.delivry = false;
    this.administration = show;

  }

  /*********************************************************************************************/
  ngOnInit(): void {
    this.loadLoggedUser();
    this.index();
    this.indexUsers();
    this.indexArtista();
    this.indexTalleres();
    this.indexOfertas();
    //this.loadArtistaName();
  }

  loadLoggedUser() {
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);
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

  redirectToUserLogin() {
    this._router.navigate(['login'])
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  loadAdmin() {
    this._router.navigate(['/shop'])
  }

  redirectToLoginArtist() {
    this._router.navigate(['/loginArtist']);
  }
  logOut() {
    sessionStorage.clear();
    this._router.navigate([''])
  }

  showConfirmationDialog() {
    this.displayConfirmationDialog = true;
  }


  getImage(obra: Obra): string | null {
    if (obra.imagen) {
      // Decodificar la imagen base64 y devolverla como una URL base64
      return 'data:image/jpeg;base64,' + obra.imagen;
    } else {
      return null;
    }
  }

  /********************************* OPEN  *********************************/
  openNew() {
    this.obra = new Obra(1, null, "", "", "", 1, true, "", null, null, null);
    this.submitted = false;
    this.productDialog = true;
  }

  openNewUser() {
    this.userAux = new User(1, "", true, "", "", null, "")
    this.submitted = false;
    this.productDialog = true;
  }

  openNewArtista() {
    this.artistaAux = new Artista(1, "", "", "", "", "")
    this.submitted = false;
    this.productDialog = true;
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

  /********************************* INDEX  *********************************/
  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
       this.obras = response['data'];
       this.obras.forEach(o => {
         if (typeof o.disponibilidad === 'string')
          {o.disponibilidad = o.disponibilidad === '1';} 
       });
       

        this.artistasList = [];
        this.loadArtistaName();

      },
      error: (err: Error) => {
        console.error('Error al cargar las obras', err);
      }
    });
  }

  indexUsers() {
    this._userService.index().subscribe({
      next: (response: any) => {
        //console.log(response);
        this.users = response['data'].filter((user: any) => user.id !== this.user.iss);
      },
      error: (err: Error) => {
        console.error('Error al cargar los users', err);
      }
    });
  }

  indexArtista() {
    this._artistaService.index().subscribe({
      next: (response: any) => {
        this.artistas = response['data'];

      },
      error: (err: Error) => {
        console.error('Error al cargar los artistas', err);
      }
    });
  }

  indexTalleres() {
    this._tallerService.index().subscribe({
      next: (response: any) => {
        //console.log('Respuesta del servicio:', response); 
        this.talleres = response['data']; 
      },
      error: (err: Error) => {
        console.error('Error al cargar los talleres', err);
      }
    });
  }    

  indexOfertas() {
    this._ofertaService.index().subscribe({
      next: (response: any) => {
       // console.log('Respuesta del servicio:', response); 
        this.ofertas = response['data']; 
        this.loadTallerName();
      },
      error: (err: Error) => {
        console.error('Error al cargar los ofertas', err);
      }
    });
  }    

  /******************************** EDIT ********************************/
  editObra(obra: Obra) {
    this.obra = { ...obra };
    this.productDialog = true;
  }

  editUser(user: User) {
    if (user.password == '') { return }
    this.userAux = { ...user };
    this.productDialog = true;
  }

  editArtista(_artista: Artista) {
    if (_artista.password == '') { return }
    this.artistaAux = { ..._artista };
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

  selectCategoria(categoria: string) {
    this.obra.categoria = categoria;
  }

  selectTecnica(tecnica: string) {
    this.obra.tecnica = tecnica;
  }

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  /********************************* UPDATE *********************************/
  updateObra(filename: any) {
    if(this.obra.disponibilidad){
    if (this.selectedFile) {
      this._obraService.updateImage(this.selectedFile, filename).subscribe({
        next: (response: any) => {
         // console.log(response);
          //this.selectedObras = [];
         
        },
        error: (err: Error) => {
          this.msgAlert('Error updating artwork', '', 'error')
        }
      });
    }
    this._obraService.update(this.obra).subscribe({
      next: (response: any) => {
        this.msgAlert('Artwork updated successfully', '', 'success')
        this.selectedObras = [];
        this.index()
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }else{this.selectedObras = [];
    this.msgAlert('Sold works cannot be updated', '', 'error')}
  }

  updateUser() {
    if (this.userAux.password === '') {
      this.msgAlert('Error, empty password', '', 'error')
      return;
    }
    this._userService.update(this.userAux).subscribe({
      next: (response: any) => {
        //console.log('User updated successfully', response);
        this.msgAlert('User updated successfully', '', 'success');
        this.selectedUsers = [];
        this.indexUsers();
      },
      error: (err: any) => {
        this.msgAlert('Error updating user', '', 'error')
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update user: ${this.userAux.nombre}`,
          life: 3000
        });
      }
    });
  }

  updateArtista() {
    if (this.artistaAux.password == '') {
      this.msgAlert('Error, empty password', '', 'error')
      return;
    }
    this._artistaService.update(this.artistaAux).subscribe({
      next: (response: any) => {
        this.selectedArtistas = [];
        this.msgAlert('Artist updated successfully', '', 'success')
        this.artistasList = [];
        this.loadArtistaName();
        this.indexArtista()
      },
      error: (err: any) => {
        this.msgAlert('Error updating artist', '', 'error')
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update artist: ${this.artistaAux.nombre}`,
          life: 3000
        });
      }
    });
  }

  updateTaller(): void {
    this._tallerService.update(this.tallerAux).subscribe({
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
    this._ofertaService.update(this.ofertaAux).subscribe({
      next: (response) => {
       // console.log(response);
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
  

  /********************************* STORE *********************************/
  storeObra(form: any): void {
    // if (form.valid) {
    //console.log('Obra:', this.obra);
    if (this.selectedFile) {
      //console.log('Imagen:', this.selectedFile);
      this._obraService.upLoadImage(this.selectedFile).subscribe({
        next: (response: any) => {
          //console.log(response);
          if (response.filename) {
            this.obra.imagen = response.filename;
            this.obra.fechaCreacion = this.fechaSeleccionada;
            this.obra.fechaRegistro = this.formattedDate;
            this._obraService.create(this.obra).subscribe({
              next: (response2: any) => {
                //console.log(response2);
                this.index()
                this.msgAlert('Artwork saved successfully', '', 'success')
              },
              error: (error: any) => {
                this.deleteImage(this.obra.imagen);

                if (error.status === 500 && error.error && error.error.error) {
                  this.errores = [];
                  const errorObj = error.error.error;
                  if (errorObj.includes('La fecha de registro debe ser igual o posterior a la fecha de creación en las obras')) {
                    this.msgAlert('The registration date must be equal to or later than the creation date', '', 'error');
                  } else {
                    if (errorObj.includes('El precio no puede ser negativo en las obras')) {
                      this.msgAlert('The price cannot be negative in the artworks', '', 'error');
                    } else {
                  this.msgAlert('Error adding artwork', this.errores, 'error');
                } }
              }else

                if (error.status === 406 && error.error && error.error.error) {
                  this.errores = [];
                  const errorObj = error.error.error;
                  for (const key in errorObj) {
                    if (errorObj.hasOwnProperty(key)) {
                      this.errores.push(...errorObj[key]);
                    }
                  }
                  this.msgAlert('Error adding artwork', this.errores, 'error');
                } 
                
                else {
                  //console.error('Other type of error:', error);
                  this.msgAlert('Error from the server, contact an administrator', '', 'error');
                }
              }
            });
          } else {
            console.error('No filename received.');
          }
        },
        error: (error: any) => {
          if (error.status === 406 && error.error && error.error.error) {
            this.errores = [];
            const errorObj = error.error.error;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            this.msgAlert('Error adding artwork', this.errores, 'error');

          } else {
            console.error('Other type of error:', error);
            this.msgAlert('Error from the server, contact an administrator', '', 'error');
          }
        }
        
      });
    } else { 
      this.msgAlert('Error you must choose an image for the artwork', '', 'error'); 
    }
  }

  storeUser(form: any): void {
    if (form.valid) {
      //console.log(this.userAux.tipoUsuario);
      this._userService.create(this.userAux).subscribe({
        next: (response) => {
          //console.log(response);
          if (response.status == 201) {
            form.reset();
            this.msgAlert('User added successfully', '', 'success');
          } else {
            console.error('Could not add the user.');
          }
        },
        error: (error: any) => {
          console.log("error al agregar user",error)
          if (error.status === 406 && error.error && error.error.error) {
            this.errores = [];
            const errorObj = error.error.error;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            this.msgAlert('Error adding user', this.errores, 'error');
          } else {
            console.error('Other type of error:', error);
            this.msgAlert('Error from the server, contact an administrator', '', 'error');
          }
        }
      });
      this.indexUsers();
    }
  }

  storeArtista(form: any): void {
    if (form.valid) {
      this._artistaService.create(this.artistaAux).subscribe({
        next: (response) => {
          //console.log(response);
          if (response.status == 201) {
            form.reset();
            this.msgAlert('Artist added successfully', '', 'success');
            this.artistasList = [];
            this.loadArtistaName();
            this.indexArtista()

          } else {
            console.error('The artist could not be entered');
          }
        },
        error: (error: any) => {
          if (error.status === 406 && error.error && error.error.errors) {
            this.errores = [];
            const errorObj = error.error.errors;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            this.msgAlert('Error adding artist', this.errores, 'error');

          } else {
            console.error('Other type of error:', error);
            this.msgAlert('Error from the server, contact an administrator', '', 'error');
          }
        }
      });
      this.indexArtista()
    }
  }

  storeTaller(form: any): void {
    if (form.valid) {
      this._tallerService.create(this.tallerAux).subscribe({
        next: (response) => {
          //console.log(response);
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
            this.errores = [];
            const errorObj = error.error.errors;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            this.msgAlert('Error adding course', this.errores, 'error');
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
      this.ofertaAux.fechaInicio = this.formatDate(new Date(this.ofertaAux.fechaInicio));
      this.ofertaAux.fechaFinal = this.formatDate(new Date(this.ofertaAux.fechaFinal));
      
      if (this.ofertaAux.horaFinal < this.ofertaAux.horaInicio) {
        this.msgAlert('The end time must be after the start time.', '', 'error');
        return;
      }
      if (this.ofertaAux.fechaFinal < this.ofertaAux.fechaInicio) {
        this.msgAlert('The end date must be equal to or after the start date.', '', 'error');
        return;
      }
      
      this._ofertaService.create(this.ofertaAux).subscribe({
        next: (response) => {
         // console.log(response);
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
            this.errores = [];
            const errorObj = error.error.errors;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            this.msgAlert('Error adding offer', this.errores, 'error');
          } else {
            console.error('Other error:', error);
            this.msgAlert('Server error, contact the administrator', '', 'error');
          }
        }
      });
    }
  }
  
  

  /********************************* DELETE *********************************/
  deleteImage(filename: string | null) {
    if (filename == null) {
      this.msgAlert('Image not deleted, it contains null', '', 'error');
      return;
    }
    this._obraService.destroyImage(filename).subscribe({
      next: (response: any) => {
        //console.log(response);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

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
      this._obraService.deleted(obra.id).subscribe({
        next: () => {
          this.obras = this.obras.filter(o => o.id !== obra.id);
          this.deleteImage(obra.imagen);
          this.totalRecords--;
          this.msgAlert('Deleted artwork', '', 'error');
        },
        error: (err: Error) => {
          console.error('Error deleting artwork', err);
          this.msgAlert('Error when deleting artwork', '', 'error');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete obra: ${obra.nombre}`,
            life: 3000
          });
        }
      });
    });

    this.selectedObras = [];
    this.displayConfirmationDialog = false;
  }

  deleteSelectedUsers() {
    this.selectedUsers.forEach(_user => {
      if(_user.id==this.user['iss']){
        this.msgAlert('The logged in user cannot be deleted', '', 'error');
        return
      }
      this._userService.deleted(_user.id).subscribe({
        next: () => {
          this.users = this.users.filter(o => o.id !== _user.id);
          this.totalRecords--;
          this.msgAlert('User Deleted', '', 'success');
        },
        error: (err: any) => {
          if (err.error && err.error.error) {
            const backendErrorMessage = err.error.error;
            this.msgAlert(`Error deleting user: ${backendErrorMessage}`, '', 'error');
          } else {
            console.error('Error deleting user:', err);
            this.msgAlert('Error deleting user. Please try again later.', '', 'error');
          }
        }
      });
    });
    this.selectedUsers = [];
    this.displayConfirmationDialog = false;
  }

  deleteSelectedArtistas() {
    this.selectedArtistas.forEach(_artista => {
      this.obras.forEach(element => {
        if (element.idArtista == _artista.id && !element.disponibilidad) {
          this.selectedArtistas = [];
          this.displayConfirmationDialog = false;
          this.msgAlert('Error, verify that the artists do not have sold artwork', '', 'error');
          return;
        }
      });
    });
      this.selectedArtistas.forEach(_artista => {
        this._artistaService.deleted(_artista.id).subscribe({
          next: () => {
            this.artistas = this.artistas.filter(o => o.id !== _artista.id);
            this.totalRecords--;
            this.msgAlert('Artist successfully removed', '', 'success');
            this.artistasList = [];
            this.loadArtistaName();
          },
          error: (err: Error) => {
            console.error('Error deleting artist', err);
          }
        });
        this.selectedArtistas = [];
        this.displayConfirmationDialog = false;
      });
    }
    hideConfirmationDialog() {
      this.displayConfirmationDialog = false;
    }

    deleteSelectedTalleres(): void {
      for (const taller of this.selectedTalleres) {
        const hasOffers = this.ofertas.some(oferta => oferta.idTaller === taller.id);
        if (hasOffers) {
          this.msgAlert('Error, the course cannot be deleted because it has linked offers', '', 'error');
          this.selectedTalleres = [];
          this.displayConfirmationDialog = false;
          return;
        }
      }
      this.selectedTalleres.forEach(taller => {
        this._tallerService.deleted(taller.id).subscribe({
          next: () => {
            this.talleres = this.talleres.filter(t => t.id !== taller.id);
            this.totalRecords--;
            this.msgAlert('Course deleted successfully', '', 'success');
            this.indexTalleres();
          },
          error: (err: Error) => {
            console.error('Error deleting course', err);
            this.msgAlert('Error deleting course', '', 'error');
          }
        });
      });
    
      this.selectedTalleres = [];
      this.displayConfirmationDialog = false;
    }
    
  
  
  
  deleteSelectedOfertas(): void {
    this.selectedOfertas.forEach(oferta => {
      this._ofertaService.deleted(oferta.id).subscribe({
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

  /*****************************  Obtener nombre  *****************************/
  loadArtistaName() {
    this._artistaService.index().subscribe({
      next: (response: any) => {
        let artistas = response['data'];
        artistas.forEach((e: any) => {
          this.artistasList.push({
            key: e.id,
            value: e.nombre
          });
        });
      },
      error: (err: Error) => {
        console.error('Error al buscar el artista', err);
      }
    });
  }

  getArtistaNameById(id: number): string {
    const artista = this.artistasList.find(p => p.key === id);
    return artista ? artista.value : 'Desconocido';
  }

  loadTallerName() {
    this._tallerService.index().subscribe({
      next: (response: any) => {
        let talleres = response['data'];
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
  }

  /************************************************************************ */
  isVirtual = false;  
  onModalidadChange(modalidad: string): void {
    this.isVirtual = modalidad === 'Online';
    if (this.isVirtual) {
      this.ofertaAux.ubicacion = '';
    }
    console.log(this.ofertaAux);  
  }
  


 

  onFechaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let [year, month, day] = input.value.split('-').map(Number);
    this.fechaSeleccionada = `${year}-${month}-${day}`;
  }

  private formatDate(date: Date): string {
    //console.log(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate(); 
    return `${year}-${month}-${day}`;
  }

  // PARA LAS HORAS 
  onHoraChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const horaCompleta = input.value; 
    const [horaInput, minutoInput] = horaCompleta.split(':');
    this.hora = horaInput.padStart(2, '0'); 
    this.minuto = minutoInput.padStart(2, '0'); 
    this.horaSeleccionada = `${this.hora}:${this.minuto}`; 
}
  horaSeleccionada: string = '';
  hora: string | null = null;
  minuto: string | null = null;
  
  private formatTime(hour: string, minute: string): string {
    const formattedHour = ('0' + hour).slice(-2);
    const formattedMinute = ('0' + minute).slice(-2);
    return `${formattedHour}:${formattedMinute}`; 
  }
  
  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }
  public parseInt(value: string){
    return parseInt(value, 10);
  }

  
  downloadBackup(): void {
    this._backupRestoreService.backupBD().subscribe(
        (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'galeria_db_Backup.bak';  // Nombre por defecto del archivo
            a.click();
            window.URL.revokeObjectURL(url);  // Limpiamos el URL temporal
        },
        error => {
            console.error('Error al hacer el backup', error);
        }
    );
}

}