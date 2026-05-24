import { Component } from '@angular/core';
import { Obra } from '../../models/Obra';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ArtistService } from '../../services/artist.service';
import { server } from '../../services/global';

@Component({
  selector: 'app-view-artwork',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './view-artwork.component.html',
  styleUrl: './view-artwork.component.css',
  providers: [ObraService, ArtistService]
})
export class ViewArtworkComponent {
  public obra: Obra;
  public status: number;
  public isLoading: boolean = false; 
  urlAPI: string;
  
  constructor(
    private _obraService: ObraService,
    private _artistService: ArtistService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private _userService: UserService
  ) {
    this.status = -1;
    this.urlAPI = server.url+'obra/getimage/';
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
  }
  user: any;
  artistName:string='Anonimo';
  


  ngOnInit(): void {this.loadLoggedUser();
    if(this.user == null){
      this.msgAlert('debe iniciar sesion',' ','error');
      this._router.navigate(['/login']);
    }else{
    const id = this._routes.snapshot.paramMap.get('id');

    if (id) {
      this.getObra(id);
    }
  }

  }
  
  getObra(id: string): void {
    this._obraService.getArtworkById(id).subscribe(
      data => {
        this.obra = data['obra'];

        if (typeof this.obra.disponibilidad === 'string')
          {this.obra.disponibilidad = this.obra.disponibilidad === '1';} 
        
        this.artistName=data['obra'].artista.nombreArtista;
        this.isLoading = true;
        this.status = 1;
        
      },
      error => {
        console.error('Error al obtener la obra:', error);
         this.isLoading = false;
        this.status = 0;
       
      }
    );
  }

  
  loadLoggedUser(){
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);
  }

  loadAdmin(){
    this._router.navigate(['/admin'])
    }

  
  logOut(){
    sessionStorage.clear();
    this._router.navigate([''])
  }

redirectToSale() {
  this._router.navigate(['sale', this.obra.id]);
}

msgAlert = (title: any, text: any, icon: any) => {
  Swal.fire({
    title,
    text,
    icon,
  })
}

}



