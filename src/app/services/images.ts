import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, map, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ImagesService {
    public images = signal<string[]>([]);
    private readonly basePath = 'images/';

    constructor(
        private http: HttpClient,
    ) {
        firstValueFrom(this.getAllImages()).then(resp => {
            this.images.set(resp);
        }).catch(err => console.log(err));
    }

    getAllImages(): Observable<string[]> {
        return this.http.get<any>(`${this.basePath}manifest.json`).pipe(
            map(manifest => manifest.files),
            map(images => images.map((image : string) => {
                return `images/${image}`;
            }))
        );
    }
}
