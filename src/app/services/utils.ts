import {Injectable, signal} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    homeBannerHeight = signal<number>(0);
}
