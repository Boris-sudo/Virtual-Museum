import { Routes } from '@angular/router';
import { Certificates } from './pages/certificates/certificates';
import { Home } from './pages/home/home';
import { Gallery } from './pages/gallery/gallery';
import { Blog } from './pages/previous-expeditions/blog/blog';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'gallery', component: Gallery },
    { path: 'certificates', component: Certificates },
    { path: 'blogs', redirectTo: '', pathMatch: 'full' },
    { path: 'blog/:id', component: Blog },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
