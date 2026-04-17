import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header';
import { Sidebar } from './core/sidebar';
import { Footer } from './core/footer';
import { ExhibitPopup } from "./elements/exhibit_popup";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Sidebar, Footer, ExhibitPopup],
    styles: `
        .content {
            min-height: 100vh;
        }
        
        .cursor-dot {
            width: 8px;
            height: 8px;
            background: var(--swiss-accent, #bf6847);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease, background 0.2s ease;
        }
        
        .cursor-ring {
            width: 40px;
            height: 40px;
            border: 1.5px solid var(--swiss-black, #1a1815);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background 0.3s ease;
            mix-blend-mode: difference;
        }
        
        .cursor-ring.hover {
            width: 60px;
            height: 60px;
            border-color: var(--swiss-accent, #bf6847);
            background: rgba(191, 104, 71, 0.1);
        }
        
        @media (max-width: 768px) {
            .cursor-dot, .cursor-ring {
                display: none;
            }
        }
    `,
    standalone: true,
    template: `
        <div class="cursor-dot" #cursorDot></div>
        <div class="cursor-ring" #cursorRing></div>
        
        <div class="container">
            <HeaderComp/>
            <SidebarComp/>
            <div class="content">
                <router-outlet/>
            </div>
            <FooterComp/>
            <ExhibitPopup/>
        </div>
    `
})
export class App implements AfterViewInit, OnDestroy {
    private dotX = 0;
    private dotY = 0;
    private ringX = 0;
    private ringY = 0;
    private animationFrame: number | null = null;

    constructor() {
    }

    ngAfterViewInit() {
        const cursorDot = document.querySelector('.cursor-dot') as HTMLElement;
        const cursorRing = document.querySelector('.cursor-ring') as HTMLElement;

        if (!cursorDot || !cursorRing) return;

        document.addEventListener('mousemove', (e: MouseEvent) => {
            this.dotX = e.clientX;
            this.dotY = e.clientY;
        });

        const animate = () => {
            this.ringX += (this.dotX - this.ringX) * 0.12;
            this.ringY += (this.dotY - this.ringY) * 0.12;

            cursorDot.style.left = `${ this.dotX }px`;
            cursorDot.style.top = `${ this.dotY }px`;
            cursorRing.style.left = `${ this.ringX }px`;
            cursorRing.style.top = `${ this.ringY }px`;

            this.animationFrame = requestAnimationFrame(animate);
        };

        animate();

        document.querySelectorAll('a, button, .tilt-card, .collection-card, .program-item').forEach((el) => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    ngOnDestroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}
