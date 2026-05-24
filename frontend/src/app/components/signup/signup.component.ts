import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { timer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  public status:number;
  public user:User;
  public errors:string[]=[];
  constructor(
    private _userService:UserService,
    private router:Router
  ){
    this.status=-1;
    this.user=new User(1,"",false,"","",null,"");
  }

  onSubmit(form:any){
    this.user.tipoUsuario=false;
    this._userService.create(this.user).subscribe({
      next:(response)=>{
        //console.log(response);
        if(response.status==201){
          form.reset();            
          this.changeStatus(0);
          this.msgAlert('User registered successfully', '', 'success');
          setTimeout(()=>{
            this.redirectToLogin()
          },1000);
        }else{
          this.changeStatus(1);
        }
      },
      error:(error:HttpErrorResponse)=>{
        //console.error('Error:', error);
        if (error.status === 406 && error.error && error.error.error) {
          this.errors = [];
          const errorObj = error.error.error;
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

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  
}
