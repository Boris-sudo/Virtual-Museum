import { Component, effect, ElementRef, HostListener, Input, signal, ViewChild } from '@angular/core';
import {ExhibitModel} from "../models/exhibit.model";
import {ExhibitService} from "../services/exhibit";

@Component({
    selector: 'ExhibitPopup',
    standalone: true,
    imports: [],
    styles: `
        .container {
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 30000;
            display: none;
            background: rgba(from var(--text-primary) r g b / 0.6);
            backdrop-filter: blur(3px);
            justify-content: center;
            overflow-y: scroll;
            overflow-x: hidden;

            .scroll-content {
                width: 100vw;
                max-width: 1200px;
                min-height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow-x: hidden;

                .image {
                    max-width: 800px;
                    width: fit-content;
                    position: relative;
                    
                    .next, .prev {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(from var(--background-primary) r g b / .3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 30px;
                        height: 30px;
                        border-radius: var(--br-100);
                        
                        &.next {
                            right: 5px;
                        }
                        
                        &.prev {
                            left: 5px;
                        }
                    }
                }

                .info {
                    width: 100%;

                    .header {
                        font-size: 25px;
                        font-weight: 600;
                        margin-bottom: 10px;
                        margin-top: 20px;
                        color: var(--background-primary);
                    }

                    .description {
                        font-size: 20px;
                        font-family: var(--ff-inter), sans-serif;
                        letter-spacing: 0.3px;
                        line-height: 120%;
                        color: var(--background-primary);
                    }
                }

                img {
                    width: auto;
                    object-fit: cover;
                    min-height: 400px;

                    @media screen and (max-width: 1000px) {
                        min-height: 300px;
                    }

                    @media screen and (max-width: 800px) {
                        height: max-content;
                        width: 100%;
                    }
                }
            }
        }

        .close {
            position: fixed;
            top: 20px;
            right: 20px;
            outline: none;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: var(--br-100);
            width: 40px;
            height: 40px;
            display: none;
            align-items: center;
            justify-content: center;
            align-content: center;
            background: transparent;
            transition-duration: .3s;
            z-index: 30001;
            
            &.visible {
                display: flex;
                background: rgba(from var(--text-primary) r g b / 0.4);
            }

            svg {
                width: 30px;
            }
        }
    `,
    template: `
        <div class="container" #container>
            <div class="scroll-content" #scroll_content>
                <div class="image">
                    <img alt="exhibit image" #image>
                    <div class="next">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M5 12l14 0"/>
                            <path d="M15 16l4 -4"/>
                            <path d="M15 8l4 4"/>
                        </svg>
                    </div>
                    <div class="prev">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M5 12l14 0"/>
                            <path d="M5 12l4 4"/>
                            <path d="M5 12l4 -4"/>
                        </svg>
                    </div>
                </div>

                <div class="info">
                    <p class="header">{{ exhibit.name }}</p>
                    <p [innerHTML]="exhibit.description" class="description"></p>
                </div>
            </div>
        </div>

        <button (click)="close_popup()" class="close" #close>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 6l-12 12"/>
                <path d="M6 6l12 12"/>
            </svg>
        </button>
    `,
})
export class ExhibitPopup {
    exhibit: ExhibitModel = {
        id: 0,
        description: '',
        name: '',
        src: [''],
    }
    bounds!: DOMRect;

    @ViewChild('container') container!: ElementRef<HTMLDivElement>;
    @ViewChild('scroll_content') scroll_content!: ElementRef<HTMLDivElement>;
    @ViewChild('image') image!: ElementRef<HTMLImageElement>;
    @ViewChild('close') closeButton!: ElementRef<HTMLButtonElement>;

    constructor(
        private exhibit_service: ExhibitService,
    ) {
        effect(() => {
            const exhibit = this.exhibit_service.exhibit_popup();
            if (this.container == undefined) return;
            if (exhibit) {
                this.exhibit = exhibit;
                this.bounds = this.exhibit_service.exhibit_bounds()!;
                this.show();
            } else {
                this.hide();
            }
        });
    }

    show() {
        if (this.container === undefined) return;
        document.body.style.overflowY = 'hidden';

        this.image.nativeElement.src = `images/exhibits/${this.exhibit.src[0]}`;

        this.closeButton.nativeElement.classList.add('visible');

        this.container.nativeElement.style.top = `${this.bounds.top}px`;
        this.container.nativeElement.style.left = `${this.bounds.left}px`;
        this.container.nativeElement.style.width = `${this.bounds.width}px`;
        this.container.nativeElement.style.height = `${this.bounds.height}px`;

        setTimeout(() => {
            this.container.nativeElement.style.display = 'flex';
            this.container.nativeElement.style.transitionDuration = '.3s';
        }, 10);

        setTimeout(() => {
            this.container.nativeElement.style.top = '0';
            this.container.nativeElement.style.left = '0';
            this.container.nativeElement.style.width = '100vw';
            this.container.nativeElement.style.height = '100vh';
            this.container.nativeElement.style.padding = '32px';

            this.image.nativeElement.style.width = '100%';

        }, 20);
    }

    hide() {
        if (this.container === undefined) return;
        this.scroll_content.nativeElement.scrollTo(0, 0);

        document.body.style.overflowY = 'scroll';

        this.container.nativeElement.style.padding = '0';
        this.container.nativeElement.style.top = `${this.bounds.top}px`;
        this.container.nativeElement.style.left = `${this.bounds.left}px`;
        this.container.nativeElement.style.width = `${this.bounds.width}px`;
        this.container.nativeElement.style.height = `${this.bounds.height}px`;
        this.closeButton.nativeElement.classList.remove('visible');

        setTimeout(() => {
            this.container.nativeElement.style.display = 'none';
            this.container.nativeElement.style.transitionDuration = '0s';
        }, 310);
    }

    @HostListener('window:keydown.escape')
    onKeyDown() {
        this.close_popup();
    }

    close_popup() {
        this.exhibit_service.exhibit_popup.set(undefined);
    }
}
