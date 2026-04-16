import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AnimationsService {

    observer: any = null;

    constructor() {
    }

    loadObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const overflow_set = entry.target.classList.contains('separate-card');
                    if (overflow_set) {
                        setTimeout(() => {
                            entry.target.classList.add('overflow-important');
                        }, 1000);
                    }
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    }

    addObservableElement(element: Element) {
        if (this.observer === null) this.loadObserver();
        this.observer.observe(element);
    }

    destroyObserver() {
        if (this.observer === null) return;
        this.observer.disconnect();
        this.observer = null;
    }
}
