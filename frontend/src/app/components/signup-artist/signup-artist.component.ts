import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Artista } from '../../models/Artista';
import { ArtistService } from '../../services/artist.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs';


@Component({
  selector: 'app-signup-artist',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterLink],
  templateUrl: './signup-artist.component.html',
  styleUrl: './signup-artist.component.css'
})
export class SignupArtistComponent {
  public status:number;
  public artista:Artista;
  public errors:string[]=[];
  constructor(
    private artistaService:ArtistService,
    private router:Router
  ){
    this.status=-1;
    this.artista=new Artista(1,"","","","","");
  }

  onSubmit(form:any){
    console.log("Artista", this.artista);
    this.artistaService.create(this.artista).subscribe({
      next:(response)=>{
        console.log(response);
        if(response.status==201){
          form.reset();            
          this.changeStatus(0);
          this.msgAlert('Artist registered successfully', '', 'success');
          setTimeout(()=>{
            this.redirectToLoginArtist()
          },1000);
        }else{
          this.changeStatus(1);
        }
      },
      error:(error:HttpErrorResponse)=>{
        // console.error('Errors:', error.error.errors);
        // console.error('Error:', error.error.error);
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
          console.error('Otro tipo de error:', error.statusText);
          this.msgAlert('Error from the server. Please contact the administrator', '', 'error');
        }
        this.changeStatus(2);
      }
    })
  }
  changeStatus(st:number){
    this.status=st;
    let countdown=timer(5000);
    countdown.subscribe(n=>{
      this.status=-1;
    })
  }

  msgAlert= (title:any, text:any, icon:any) =>{
    Swal.fire({
      title,
      text,
      icon,
    })
  }

  redirectToLoginArtist() {
    this.router.navigate(['/loginArtist']);
  }

}

