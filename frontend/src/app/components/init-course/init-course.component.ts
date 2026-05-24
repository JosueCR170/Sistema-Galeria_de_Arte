import { Component } from '@angular/core';
import { TallerService } from '../../services/taller.service';
import { OfertaService } from '../../services/oferta.service';
import { ArtistService } from '../../services/artist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaService } from '../../services/matricula.service';
import { Artista } from '../../models/Artista';
import { Matricula } from '../../models/Matricula';
import Swal from 'sweetalert2';
import { Taller } from '../../models/Taller';
import { Oferta } from '../../models/Oferta';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-init-course',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './init-course.component.html',
  styleUrl: './init-course.component.css'
})
export class InitCourseComponent {

  public artista: Artista;
  public matricula: Matricula;
  constructor(
    private _talleresService:TallerService,
    private _ofertaService:OfertaService,
    private _artistaService: ArtistService,
    private router: Router,
    private _artistService: ArtistService,
    private _matriculaService: MatriculaService
  ){this.artista = new Artista(1, "", "", "", "", ""),
  this.matricula = new Matricula(1,1,1,"",1)}
  facturaResponse: any;
respuesta: any;
selectedCourse: Taller = new Taller(1,1,"","",1,1,"");
selectedCategory: string = 'all';
selectedOffer: Oferta | any;
courses: Taller[] = [];
filteredOfertas: Oferta[] = [];
artistas: Artista[] =[];
ofertas: Oferta[] =[];
user: any;

ngOnInit(): void {
  this.indexCourses();
  this.loadOferta();
}


indexCourses(){
  this._talleresService.index().subscribe({
    next: (response: any) =>{
      this.courses = response['data']; 
    
    },
    error: (err) => {
      console.error('Error al cargar los talleres:', err);
    }
  });
 }

 getGroupedCourses(courses: any[]): any[][] {
 
  const groupedCourses = [];
  const numberOfCoursesToShow = 6; // Mostrar solo los primeros 6 cursos
  const coursesToShow = courses.slice(0, numberOfCoursesToShow); // Limitar los cursos a 6

  // Agrupar los cursos en grupos de 3
  for (let i = 0; i < coursesToShow.length; i += 3) {
    groupedCourses.push(coursesToShow.slice(i, i + 3));
  }

  return groupedCourses;
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

getArtistaName(artistaId: number | null): string | undefined {
  if (artistaId === null) {
    console.log('eeee')
    return undefined; // O manejar el caso de manera apropiada
  }
  const artista = this.artistas.find(a => a.id == artistaId);
  return artista ? artista.nombreArtista : 'Artista desconocido'; // Retorna el nombre del artista o un valor por defecto
}

loadLoggedUser() {
  this.user = sessionStorage.getItem('identity');
  this.user = JSON.parse(this.user);
}


loadOferta():void{
  this._ofertaService.index().subscribe({
    next: (response: any) =>{
      this.ofertas = response['data'];
    },error: (err) => {
      console.error('Error al cargar artistas:', err);
    }
  })
}

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
  

  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const ofertaId = Number(selectElement.value);
    console.log("id oferta: ", ofertaId)
    if (ofertaId) {
      this.selectedOffer = this.filteredOfertas.find(oferta => oferta.id == ofertaId);
    } else {
      this.selectedOffer = null;
    }

  }

  getCourse(course: Taller){
    this.selectedCourse = course;
    this.filteredOfertas = this.ofertas.filter(oferta => oferta.idTaller == this.selectedCourse.id);
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
        respuesta = facturaResponse; // Guardamos la respuesta para usarla luego en getArtist.
        this.respuesta = respuesta;  // Almacena respuesta para verificar el status luego en getArtist
        this.getArtist(this.selectedCourse.idArtista); // Llamamos a getArtist y manejamos el mensaje allí.
      },
      error: (err) => {
        console.error('Error al realizar matrícula', err);

      }
    });
    this.router.navigate([`courses`]);
  }
  CloseCanvas(){
    this.selectedOffer = null;
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
  
  navigateToCourse(route: string) {
    console.log('Navegando a la categoría:', route);
    this.router.navigate(['/courses/category',route]);
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
