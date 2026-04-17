import { Component, effect, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { ExhibitModel } from "../models/exhibit.model";
import { ExhibitService } from "../services/exhibit";

@Component({
    selector: 'ExhibitPopup',
    standalone: true,
    imports: [],
    styles: `
        .popup-overlay {
            --swiss-black: #1a1815;
            --swiss-white: #fafafa;
            --swiss-gray: #6b6560;
            --swiss-light: #e8e6e3;
            --swiss-accent: #bf6847;
            
            position: fixed;
            inset: 0;
            z-index: 30000;
            display: flex;
            align-items: stretch;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .popup-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .popup-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(26, 24, 21, 0.95);
            backdrop-filter: blur(8px);
        }

        .popup-container {
            position: relative;
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            background: var(--swiss-white);
            overflow: hidden;
            display: grid;
            grid-template-columns: 1fr 1fr;
            transform: scale(0.98);
            transition: transform 0.4s cubic-bezier(0.5, 0, 0, 1);
        }

        .popup-overlay.active .popup-container {
            transform: scale(1);
        }

        .popup-close {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 44px;
            height: 44px;
            background: rgba(26, 24, 21, 0.8);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: all 0.3s ease;
        }

        .popup-close:hover {
            background: var(--swiss-accent);
            transform: rotate(90deg);
        }

        .popup-close svg {
            width: 18px;
            height: 18px;
            color: var(--swiss-white);
        }

        .popup-image-section {
            position: relative;
            background: var(--swiss-black);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .popup-image-section img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 32px;
        }

        .image-nav {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
        }

        .image-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .image-dot.active {
            background: var(--swiss-accent);
            transform: scale(1.4);
        }

        .popup-info-section {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .popup-header {
            padding: 28px 28px 20px;
            border-bottom: 1px solid var(--swiss-light);
            flex-shrink: 0;
        }

        .popup-category {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--swiss-accent);
            margin-bottom: 8px;
        }

        .popup-title {
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.02em;
            color: var(--swiss-black);
            margin: 0;
        }

        .popup-content {
            padding: 20px 28px 24px;
            overflow-y: auto;
            flex: 1;
            -webkit-overflow-scrolling: touch;
        }

        .popup-description {
            font-size: 14px;
            line-height: 1.75;
            color: var(--swiss-gray);
            font-family: var(--ff-tinos), Georgia, serif;
        }

        .popup-description :deep(p) {
            margin: 0 0 14px;
        }

        .popup-description :deep(p:last-child) {
            margin-bottom: 0;
        }

        .popup-footer {
            padding: 16px 28px;
            border-top: 1px solid var(--swiss-light);
            display: flex;
            gap: 10px;
            flex-shrink: 0;
        }

        .footer-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background: transparent;
            border: 1px solid var(--swiss-light);
            font-family: inherit;
            font-size: 12px;
            font-weight: 500;
            color: var(--swiss-gray);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .footer-btn:hover:not(:disabled) {
            border-color: var(--swiss-black);
            color: var(--swiss-black);
        }

        .footer-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }

        .footer-btn svg {
            width: 14px;
            height: 14px;
        }

        @media (max-width: 850px) {
            .popup-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                max-width: none;
                width: 100%;
                height: 100%;
                max-height: none;
                grid-template-columns: 1fr;
                grid-template-rows: auto 1fr;
            }

            .popup-image-section {
                height: 40vh;
                min-height: 200px;
                max-height: 45vh;
            }

            .popup-image-section img {
                padding: 20px;
            }

            .popup-close {
                top: 12px;
                right: 12px;
                width: 40px;
                height: 40px;
            }

            .popup-info-section {
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .popup-header {
                padding: 20px 20px 16px;
            }

            .popup-content {
                padding: 16px 20px;
            }

            .popup-footer {
                padding: 12px 20px;
                position: sticky;
                bottom: 0;
                background: var(--swiss-white);
            }

            .popup-title {
                font-size: 1.3rem;
            }
        }

        @media (max-width: 480px) {
            .popup-image-section {
                height: 35vh;
                min-height: 180px;
            }

            .popup-header {
                padding: 16px 16px 12px;
            }

            .popup-content {
                padding: 12px 16px 16px;
            }

            .popup-footer {
                padding: 10px 16px;
            }

            .popup-title {
                font-size: 1.2rem;
            }

            .footer-btn {
                flex: 1;
                justify-content: center;
            }
        }
    `,
    template: `
        <div class="popup-overlay" [class.active]="isOpen()">
            <div class="popup-backdrop" (click)="close_popup()"></div>
            
            <div class="popup-container">
                <button class="popup-close" (click)="close_popup()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                
                <div class="popup-image-section">
                    <img [src]="currentImage()" [alt]="exhibit.name" />
                    
                    @if (exhibit.src.length > 1) {
                        <div class="image-nav">
                            @for (img of exhibit.src; track img; let i = $index) {
                                <div 
                                    class="image-dot" 
                                    [class.active]="currentIndex() === i"
                                    (click)="goToImage(i)"
                                ></div>
                            }
                        </div>
                    }
                </div>
                
                <div class="popup-info-section">
                    <div class="popup-header">
                        <p class="popup-category">Экспонат • №{{ exhibit.id }}</p>
                        <h2 class="popup-title">{{ exhibit.name }}</h2>
                    </div>
                    
                    <div class="popup-content" #scroll_container>
                        <div class="popup-description" [innerHTML]="exhibit.description"></div>
                    </div>
                    
                    <div class="popup-footer">
                        <button class="footer-btn" (click)="prevImage()" [disabled]="currentIndex() === 0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                            Назад
                        </button>
                        <button class="footer-btn" (click)="nextImage()" [disabled]="currentIndex() >= exhibit.src.length - 1">
                            Далее
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ExhibitPopup {
    exhibit: ExhibitModel = {
        id: 0,
        description: '',
        name: '',
        src: [''],
    };

    bounds!: DOMRect;
    isOpen = signal(false);
    currentIndex = signal(0);

    @ViewChild('container') container!: ElementRef<HTMLDivElement>;
    @ViewChild('scroll_container') scroll_container!: ElementRef<HTMLDivElement>;

    constructor(
        private exhibit_service: ExhibitService,
    ) {
        effect(() => {
            const exhibit = this.exhibit_service.exhibit_popup();
            if (exhibit) {
                this.exhibit = exhibit;
                this.bounds = this.exhibit_service.exhibit_bounds()!;
                this.currentIndex.set(0);
                this.show();
            } else {
                this.hide();
            }
        });
    }

    currentImage() {
        return `images/exhibits/${ this.exhibit.src[this.currentIndex()] }`;
    }

    goToImage(index: number) {
        this.currentIndex.set(index);
    }

    prevImage() {
        if (this.currentIndex() > 0) {
            this.currentIndex.update(i => i - 1);
        }
    }

    nextImage() {
        if (this.currentIndex() < this.exhibit.src.length - 1) {
            this.currentIndex.update(i => i + 1);
        }
    }

    show() {
        this.isOpen.set(true);
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.isOpen.set(false);
        document.body.style.overflow = '';
        if (this.scroll_container?.nativeElement) {
            this.scroll_container.nativeElement.scrollTop = 0;
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (!this.isOpen()) return;

        if (event.key === 'Escape') {
            this.close_popup();
        } else if (event.key === 'ArrowLeft') {
            this.prevImage();
        } else if (event.key === 'ArrowRight') {
            this.nextImage();
        }
    }

    close_popup() {
        this.exhibit_service.exhibit_popup.set(undefined);
    }
}
