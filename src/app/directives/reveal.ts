import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[reveal]'
})
export class RevealDirective implements AfterViewInit {
    @Input({ alias: 'reveal', required: false }) animationType: string = 'reveal';
    @Input({ alias: 'reveal-delay', required: false }) delay: number = 0;

    constructor(private el: ElementRef<HTMLElement>) {
    }

    ngAfterViewInit() {
        this.el.nativeElement.classList.add('reveal', this.animationType);
        if (this.delay > 0) {
            this.el.nativeElement.style.transitionDelay = `${ this.delay }s`;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(this.el.nativeElement);
    }
}
