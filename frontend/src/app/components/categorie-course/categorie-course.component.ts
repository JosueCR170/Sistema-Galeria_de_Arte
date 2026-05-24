import { Component } from '@angular/core';
import { TallerService } from '../../services/taller.service';
import { OfertaService } from '../../services/oferta.service';
import { Taller } from '../../models/Taller';
import { Oferta } from '../../models/Oferta';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Artista } from '../../models/Artista';
import { ArtistService } from '../../services/artist.service';
import { MatriculaService } from '../../services/matricula.service';
import { Matricula } from '../../models/Matricula';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorie-course',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categorie-course.component.html',
  styleUrl: './categorie-course.component.css'
})
export class CategorieCourseComponent {
[x: string]: any;
/*Icons:
<span class="material-symbols-outlined"> apparel </span>  <-- fasion 
<span class="material-symbols-outlined"> brush </span> <-- arte
<span class="material-symbols-outlined">photo_camera</span> <--foto
<span class="material-symbols-outlined"> deployed_code </span> <-- 3D
<span class="material-symbols-outlined">person_check</span> <-- UX
*/
public artista: Artista;
public matricula: Matricula;
constructor(
  private _talleresService:TallerService,
  private _ofertaService:OfertaService,
  private _artistaService: ArtistService,
  private router: Router,
  private _routes: ActivatedRoute,
  private _artistService: ArtistService,
  private _matriculaService: MatriculaService
){this.artista = new Artista(1, "", "", "", "", ""),
this.matricula = new Matricula(1,1,1,"",1)}
courses: Taller[] = [];
auxCourse: Taller[] = [];
filteredCourses: Taller[] = [];
ofertas: Oferta[] =[];
filteredOfertas: Oferta[] = [];
artistas: Artista[] =[];
selectedCourse: Taller = new Taller(1,1,"","",1,1,"");
selectedCategory: string = 'all';
selectedOffer: Oferta | any;
user:any;
facturaResponse: any;
respuesta: any;
category: string | null = null;

ngOnInit(): void {  
  this._routes.queryParams.subscribe(params => {
    const searchQuery = params['search'] || '';

    if (searchQuery) {
      // Filtra los cursos que coincidan con el término de búsqueda
      this.filteredCourses = this.courses.filter(course =>
        course.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      // Si no hay búsqueda, muestra todos los cursos
      this.filteredCourses = [...this.courses];
    }
  });

  this._routes.paramMap.subscribe(params => {
    this.category = params.get('category');
    this.indexCategory( this.category);
    this.loadArtistas();
    this.loadOferta();
    this.loadLoggedUser();
  });
 }

 indexCategory(Tcategory: any){
  this._talleresService.index().subscribe({
    next: (response: any) =>{
      this.courses = response['data'];
      this.filterCourses(Tcategory)
    },
    error: (err) => {
      console.error('Error al cargar los talleres:', err);
    }
  });
 }

 loadArtistas(): void {
  this._artistaService.index().subscribe({
    next: (response: any) => {
      this.artistas = response['data']; 
    },
    error: (err) => {
      console.error('Error al cargar artistas:', err);
    }
  });
}

loadLoggedUser() {
  this.user = sessionStorage.getItem('identity');
  this.user = JSON.parse(this.user);
}


  loadOferta():void{
    this._ofertaService.index().subscribe({
      next: (response: any) =>{
        this.ofertas = response['data'];
      },
      error: (err) => {
        console.error('Error al cargar las ofertas:', err);
      }
    });
  }

 filterCourses(category: string) {
  this.selectedCategory = category; // Actualiza la categoría seleccionada
  if (category === 'all') {
    this.filteredCourses = this.courses; // Muestra todos los cursos
  } else {
    this.filteredCourses = this.courses.filter(course => course.categoria === category); // Filtra por categoría
  }
}

onSelect(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const ofertaId = Number(selectElement.value);
  console.log("id oferta: ", ofertaId)
  if (ofertaId) {
    this.selectedOffer = this.filteredOfertas.find(oferta => oferta.id == ofertaId);
  } else {
    this.selectedOffer = null;
  }
  console.log(this.selectedOffer)
}

getCourse(course: Taller){
  this.selectedCourse = course;
  this.filteredOfertas = this.ofertas.filter(oferta => oferta.idTaller == this.selectedCourse.id);
}
 CloseCanvas(){
  this.selectedOffer = null;
 }
/*artista*/
getArtist(artistId: number) {
  this._artistService.showArtist(artistId).subscribe({
    next: (response) => {
      this.artista = response.Artista;
      // Después de obtener el artista, mostramos el mensaje.
      if (this.respuesta.status == 201) {
        const mensaje = `Take screenshot<br>
          <p>Contact the author <strong>${this.artista.nombre}</strong> to make the payment</p>
          <p>Artist phone: <strong>${this.artista.telefono}</strong></p>
          <p>Artist email: <strong>${this.artista.correo}</strong></p>`;
        this.msgAlertHTML('Shipment registered successfully', mensaje, 'success');
      }
    },
    error: (error) => {
      console.log('Error al obtener el artista:', error);
    }
  });
}

createPay(): void {
  let tokene: any = '';
    if (!this.user || !tokene) {
      this.user = sessionStorage.getItem('identity');
        tokene = sessionStorage.getItem('token');
      if (this.user) {
        this.user = JSON.parse(this.user);
      }
    }
    if (!this.user || isNaN(this.user['iss']) || !this.user['iss']|| !tokene ) {
      const mensaje = `
        <p>Error when making purchase</p>
        <p>Session expired or purchase processing error, try again</p>`;
      this.msgAlertHTML('Error when registering', mensaje, 'error');
      this.router.navigate(['/login']);
      return; // Salir de la función si hay un error con 'iss'
    }

  const fechaActual = new Date();
  this.matricula.costo = this.selectedCourse.costo;
  this.matricula.fechaMatricula = fechaActual.toISOString().split('T')[0];
  this.matricula.idOferta = this.selectedOffer.id;
  this.matricula.idUsuario = Number(this.user['iss']);
  
  let respuesta: any;
  this._matriculaService.create(this.matricula).subscribe({
    next: (facturaResponse) => {
      respuesta = facturaResponse; 
      this.respuesta = respuesta;  
      this.getArtist(this.selectedCourse.idArtista);
    },
    error: (err) => {
      console.error('Error al realizar matrícula', err);
    }
  });
  this.router.navigate([`courses`]);
}

getArtistaName(artistaId: number | null): string | undefined {
  if (artistaId === null) {
    console.log('eeee')
    return undefined; // O manejar el caso de manera apropiada
  }
  const artista = this.artistas.find(a => a.id == artistaId);
  return artista ? artista.nombreArtista : 'Artista desconocido'; // Retorna el nombre del artista o un valor por defecto
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


msgAlertHTML(title: any, html: any, icon: any) {
  Swal.fire({
    title,
    html,
    icon,
    confirmButtonText: 'OK',
  }).then((result) => {
    // Verificar si el usuario hizo clic en el botón "OK"
    if (result.isConfirmed) {
      // Refrescar la página
      location.reload(); // Esto recargará la página actual
    }
  });
}

}