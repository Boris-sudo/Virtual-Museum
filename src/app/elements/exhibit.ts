import { Component, effect, ElementRef, Input, ViewChild } from '@angular/core';
import { ExhibitModel } from "../models/exhibit.model";
import { ExhibitService } from "../services/exhibit";

@Component({
    selector: 'Exhibit',
    standalone: true,
    imports: [],
    styles: `
        .container {
            width: 100%;
        }

        .image-container {
            width: 100%;
            border-radius: 22px;
            overflow: hidden;
            cursor: pointer;
            background: rgba(from var(--background-neutral) r g b / 0.55);

            img {
                width: 100%;
                height: 360px;
                object-fit: cover;
                display: block;
                transition: transform .4s ease;

                &:hover {
                    transform: scale(1.03);
                }
                
                @media screen and (max-width: 1000px) {
                    height: 300px;
                }

                @media screen and (max-width: 800px) {
                    height: auto;
                    max-height: 420px;
                }
            }
        }
    `,
    template: `
        <div class="container">
            <div (click)="show_popup()" class="image-container">
                <img [src]="'images/exhibits/' + exhibit?.src?.[0]" [alt]="exhibit?.name || 'Экспонат'" #imageElement>
            </div>
        </div>
    `,
})
export class Exhibit {
    @Input() exhibitId!: number;
    @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
    exhibit: ExhibitModel = {
        id: 0,
        description: '',
        name: '',
        src: [''],
    }

    constructor(
        private exhibit_service: ExhibitService,
    ) {
        effect(() => {
            const arr = this.exhibit_service.exhibits();
            if (arr.length > 0)
                this.exhibit = this.exhibit_service.getById(this.exhibitId)!;
        });
    }

    show_popup() {
        const bounds: DOMRect = this.imageElement.nativeElement.getBoundingClientRect();
        this.exhibit_service.exhibit_popup.set(this.exhibit);
        this.exhibit_service.exhibit_bounds.set(bounds);
    }
}
