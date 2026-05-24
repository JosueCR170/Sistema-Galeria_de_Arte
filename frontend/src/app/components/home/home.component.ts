import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObraService } from '../../services/obra.service';
import { Obra } from '../../models/Obra';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { server } from '../../services/global';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
obras: Obra[] = [];
  allImages:string[]=[];
  images: string[] = [];
  urlAPI: string;
  placeholderImage:string = '/assets/img/image_not_found.png'; //imagen por defecto por si no se encuentran nuevas imagenes

  constructor(private _obraService: ObraService){ 
    this.urlAPI = server.url+'obra/getimage/'; }

  ngOnInit(): void{
    this.logOut();
    this.getImageObras();
  }

  logOut() {
    sessionStorage.clear();
  }

  getImageObras() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.obras.forEach(element => {
          if (element.imagen) {
            this.allImages.push(element.imagen);
        }
        });

        this.images=this.getRandomImages(this.allImages,12);
        //console.log('Randomized Images:', this.images);
      },
      error: (err: Error) => {
        console.log('error',err)

      }
    })  
   
  }

   getRandomInt(num:number ) {
    return Math.floor(Math.random() * num);
  }

  getRandomImages(images: string[], count: number): string[] {
    const selectedImages: string[] = [];
    const usedIndexes: Set<number> = new Set();
    if (images.length === 0) {
      return Array(count).fill(this.placeholderImage);
    }
  
    while (selectedImages.length < count) {
      const randomIndex = this.getRandomInt(images.length);
      if (usedIndexes.has(randomIndex)) {
        continue;
      }
  
      const selectedImage = images[randomIndex];
      selectedImages.push(selectedImage);
      usedIndexes.add(randomIndex); 
  
      if (selectedImages.length >= images.length) {
        break;
      }
    }
    while (selectedImages.length < count) {
      selectedImages.push(this.placeholderImage);
    }
  
    return selectedImages;
  }
  
  

 


}
