import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ViewArtworkComponent } from './components/view-artwork/view-artwork.component';
import { ShopComponent } from './components/shop/shop.component';
import { SaleComponent } from './components/sale/sale.component';
import { LoginArtistComponent } from './components/login-artist/login-artist.component';
import { SignupArtistComponent } from './components/signup-artist/signup-artist.component';
import { ArtistaAdministrationComponent } from './components/artista-administration/artista-administration.component';
import { AdminComponent } from './components/admin/admin.component';
import { CoursesComponent } from './components/courses/courses.component'
import { InitCourseComponent } from './components/init-course/init-course.component';
import { CategorieCourseComponent } from './components/categorie-course/categorie-course.component';

export const routes: Routes = [

    //{path:'',component: CoursesComponent},
    {path:'',component: HomeComponent},
    //{path:'home',component: HomeComponent},

    {path:'login',component: LoginComponent},
    {path:'login/signup', component: SignupComponent},
    {path:'shop/viewArtwork/:id', component: ViewArtworkComponent},
    {path:'shop',component:ShopComponent}, 
    {path:'shop/viewArtwork/:id/sale/:saleId', component: SaleComponent},
    {path:'sale/:artistId',component:SaleComponent},
    {path:'loginArtist', component:LoginArtistComponent},
    {path:'signupArtist', component:SignupArtistComponent},
    {path:'artistaAdministration', component:ArtistaAdministrationComponent},
    {path:'admin', component:AdminComponent},
    {path:'courses',component: CoursesComponent,
    children: [
        { path: '', component: InitCourseComponent},
        { path: 'category/:category', component: CategorieCourseComponent }
    ]},
];
