import {Injectable, signal} from '@angular/core';
import {ExhibitModel} from "../models/exhibit.model";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, forkJoin, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExhibitService {
    public exhibits = signal<ExhibitModel[]>([]);
    public exhibit_popup = signal<ExhibitModel | undefined>(undefined);
    public exhibit_bounds = signal<DOMRect | undefined>(undefined);
    private readonly basePath = 'exhibits/';

    constructor(
        private http: HttpClient,
    ) {
        firstValueFrom(this.parseAll()).then(resp => {
            firstValueFrom(resp).then(r => {
                this.exhibits.set(r);
            });
        }).catch(err => console.log(err));
    }

    parseAll(): Observable<Observable<any>> {
        return this.http.get<any>(`${this.basePath}manifest.json`).pipe(
            map(manifest => manifest.files),
            map(files => files.map((file: string) =>
                this.http.get<any>(`${this.basePath}${file}`)
            )),
            map(requests => forkJoin(requests))
        );
    }

    getAll(): ExhibitModel[] {
        return this.exhibits();
    }

    getById(id: number): ExhibitModel | undefined {
        for (const exhibit of this.exhibits()) {
            if (exhibit.id === id)
                return exhibit;
        }
        return undefined;
    }
}
