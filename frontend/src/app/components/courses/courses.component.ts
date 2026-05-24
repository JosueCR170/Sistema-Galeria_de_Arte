import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Taller } from '../../models/Taller';
import { TallerService } from '../../services/taller.service';
import { OfertaService } from '../../services/oferta.service';
import { Oferta } from '../../models/Oferta';
import { MatriculaService } from '../../services/matricula.service';
import { Matricula } from '../../models/Matricula';
import { find } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterModule, FormsModule,CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  private checkIdentity;
  constructor(private router: Router,
    private userService: UserService,
    private _talleresService: TallerService,
    private _ofertaService: OfertaService,
    private _matricula: MatriculaService) {
      this.checkIdentity=setInterval(()=>{
        this.verificarToken()
      },5000)
    }
  user: any;
  userAux = new User(1, "", false, "", "", null, "");
  filteredCourses: any[] = [];
  courses: Taller[] = [];
  ofertas: Oferta[] = [];
  ofertasFilter: Oferta[] = [];
  matriculas: Matricula[]=[];
  isLoading: boolean = false;

  ngOnInit(): void { ;
    this.loadLoggedUser();
    this.loadData();
  }

  navigateTo(course: string) {
    this.router.navigate([`courses/${course}`]);
  }

   //---------VERIFICAR TOKEN-----------------
   verificarToken() {
    this.userService.verifyToken().subscribe({
      next: (response: any) => {

        if (!response) {
          sessionStorage.clear();
          this.router.navigate(['']);
          //location.reload();
          this.msgAlert('Token caducado','Inicia sesión nuevamente','error');
        } else {
         this.user = this.userService.getIdentityFromStorage();
        }
      },
      error: (err: Error) => {
        console.log('error del response',err);
      }
    });
  }

  loadLoggedUser() {
    this.user = sessionStorage.getItem('identity');
    if (!this.user){
      this.router.navigate(['/login']);
    }else{
  
    this.user = JSON.parse(this.user);
    }
  }
  
  loadAdmin() {
    this.router.navigate(['/admin'])
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate([''])
  }
  resetUserData() {
    this.user = { ...this.userAux };
  }

  updateUser() {
    this.user.id = this.user.iss;
    console.log('User antes de ', this.user);
    this.userService.update(this.user).subscribe({
      next: (response: any) => {
        console.log('Usuario actualizado', response);
        this.msgAlert('updated user', '', 'success');
        //this.loadLoggedUser();

        let storedUserInfo = sessionStorage.getItem('identity');
        let userInfo;
        if (storedUserInfo) {
          userInfo = JSON.parse(storedUserInfo);
        } else {
          // Proporcionar un objeto predeterminado en caso de que storedUserInfo sea null
          userInfo = {};
        }
        // Actualiza solo las propiedades necesarias
        userInfo.telefono = this.user.telefono;
        userInfo.nombre = this.user.nombre;
        // Guarda el objeto actualizado de nuevo en sessionStorage
        sessionStorage.setItem('identity', JSON.stringify(userInfo));
        location.reload();
        this.router.navigate(['/courses']);
        console.log('User', this.user);
        // console.log('UserAUX',this.userAux);
      },
      error: (err: any) => {
        console.error('Error al actualizar el usuario', err.error.message);
        this.msgAlert('error updating user', '', 'error');
      }
    });
  }

  async loadData() {
    try {
      await this.indexCategory();
      await this.loadOferta();
      await this.loadMatricula(); 
    } catch (error) {
      console.error('Error loading data', error);
    }
  }



  indexCategory(){
    this._talleresService.index().subscribe({
      next: (response: any) =>{
        this.courses = response['data'];
      },
      error: (err) => {
        console.error('Error al cargar los talleres:', err);
      }
    });
   }

   loadOferta():void{
    this._ofertaService.index().subscribe({
      next: (response: any) =>{
        this.ofertas = response['data'];
      },error: (err) => {
        console.error('Error al cargar artistas:', err);
      }
    });
  }

  loadMatricula():void{
    this._matricula.index().subscribe({
      next: (response: any) =>{
        this.matriculas = response['data'];
      },error: (err) => {
        console.error('Error al cargar artistas:', err);
      }
    });
  }

   filterCourses() {
    const userMatriculas = this.matriculas.filter(matricula => matricula.idUsuario == this.user.iss);
    this.filteredCourses = [];
    //console.log(this.matriculas.filter(matricula => matricula.idUsuario == this.user.iss))
    userMatriculas.forEach(matricula => {
    const oferta = this.ofertas.find(oferta => oferta.id === matricula.idOferta);
    if (oferta) {
      const taller = this.courses.find(taller => taller.id === oferta.idTaller);
      if (taller) {  
        this.filteredCourses.push({
          taller: taller,
          oferta: oferta,
          matricula:matricula
        });
        
      }
    }
  });

  this.isLoading = false; 
  }


  searchCourses(event: any) {
      console.log("aa")
    const query = event.target.value.trim().toLowerCase();
  
    if (query === '') {
      // Si el input está vacío, redirige al inicio.
      this.router.navigate(['/courses']);
    } else {
      // Redirige a la ruta de /category/all y pasa el término de búsqueda como parámetro
      this.router.navigate(['courses/category/all'], { queryParams: { search: query } });
    }
  }

  getIconForCategory(category: string): string {
    switch (category) {
      case 'Photograph':
        return 'photo_camera';
      case 'Fashion':
        return 'apparel';
      case '3D':
        return 'deployed_code';
      case 'Art':
        return 'brush';
      case 'UI-UX':
        return 'person_check';
      default:
        return 'help'; // Icono por defecto
    }
  }

  getLongerNameCategory(category: string): string {
    switch (category) {
      case 'Photograph':
        return 'Photograph';
      case 'Fashion':
        return 'fashion design';
      case '3D':
        return '3D dising';
      case 'Art':
        return ' Principles of art';
      case 'UI-UX':
        return 'UX/UI';
      default:
        return 'help'; // Icono por defecto
    }
  }
  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }

  }
