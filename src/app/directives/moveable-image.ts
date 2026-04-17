import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[moveable-image]'
})
export class MoveableImage implements AfterViewInit {
    @Input({ alias: 'max-deg', required: false }) MAX_DEG: number = 4;

    constructor(
        private el: ElementRef<HTMLDivElement>,
    ) {
    }

    ngAfterViewInit() {
        this.el.nativeElement.addEventListener('mouseenter', () => {
            this.onMouseEnter(this.el.nativeElement);
        });
    }

    onMouseEnter(image: HTMLDivElement) {
        image.addEventListener('mousemove', (e) => {
            this.onMouseMove(e, image);
        });
        image.addEventListener('mouseleave', () => {
            this.onMouseLeave(image);
        });
    }

    onMouseMove(e: MouseEvent, image: HTMLDivElement) {
        const bound = image.getBoundingClientRect();
        const centerX = bound.x + bound.width / 2;
        const centerY = bound.y + bound.height / 2;

        const x = e.clientX - centerX;
        const y = e.clientY - centerY;
        const degX = (x * 2 / bound.width) * this.MAX_DEG;
        const degY = (y * 2 / bound.height) * this.MAX_DEG;

        image.style.transform = `perspective(1500px) rotateY(${ -degX }deg) rotateX(${ degY }deg) scale3d(1,1,1)`;
    }

    onMouseLeave(image: HTMLDivElement) {
        image.style.transform = `perspective(1500px) rotateY(0deg) rotateX(0deg)`;
        image.removeEventListener('mousemove', (e) => {
            this.onMouseMove(e, image)
        });
        image.removeEventListener('mouseleave', () => {
            this.onMouseLeave(image);
        });
    }
}
