import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AnimationsService } from '../services/animations';

@Directive({
    standalone: true,
    selector: '[split-heading]'
})
export class SplitHeading implements AfterViewInit {
    @Input() splitText!: string;

    constructor(
        private el: ElementRef<HTMLHeadingElement>,
        private renderer: Renderer2,
        private animationsService: AnimationsService
    ) {
    }

    ngAfterViewInit() {
        this.splitIntroChars(this.el.nativeElement);
    }

    splitIntroChars(header: Element) {
        header.innerHTML = '';
        header.classList.add('split-header');
        const text = this.splitText ?? header.textContent.trim();
        Array.from(text).forEach((char, index) => {
            const span = this.renderer.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--i', index);
            header.appendChild(span);
        });
        setTimeout(() => {
            this.animationsService.addObservableElement(header);
        }, 100);
    }
}
