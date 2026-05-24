import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Artista } from '../../models/Artista';
import { ArtistService } from '../../services/artist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-artist',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-artist.component.html',
  styleUrl: './login-artist.component.css',
  providers:[ArtistService]
})
export class LoginArtistComponent {
  public status:number;
  public artist:Artista;
  constructor(
    private _artistService: ArtistService,
    private _router:Router,
    private _routes:ActivatedRoute
  ){
    this.status=-1;
    this.artist=new Artista(1,"","","","","")
  }

  ngOnInit(){
    this.logOut();
  }

  logOut() {
    sessionStorage.clear();
  }

  onSubmitArtist(form:any){
    this._artistService.loginArtist(this.artist).subscribe({
      next:(response:any)=>{
        if(response.status != 401){
          sessionStorage.setItem("token", response);
          this._artistService.getIdentityFromAPI().subscribe({
            next:(resp:any)=>{
              sessionStorage.setItem('identity', JSON.stringify(resp));
              this._router.navigate(['/artistaAdministration'])
              //console.log(resp);
            },
            error:(error:Error)=>{

            }
          })
        } else {
          this.status = 0;
          this.msgAlert('Incorrect email and/or password', 'error');
          form.reset(); 
        }
      },
      error: (err: any) => {
        console.log(err);
        this.status = 1;
        this.msgAlert('Error from the server. Please contact the administrator', 'error');
      }
    })
  }
  
  backLogin(){
    if(sessionStorage.getItem('identity')){
      this._router.navigate(['/shop'])
    }else{
      this._router.navigate(['/login'])
    }
  }


  msgAlert= (title:any, icon:any) =>{
    Swal.fire({
      title,
      icon,
    })
  }
}
