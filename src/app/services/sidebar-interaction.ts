import {effect, Injectable, signal} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SidebarInteractionService {
    private readonly PROGRESS_TIMEOUT = 1200;
    status = signal<boolean>(false);
    inProgress = signal<boolean>(false);

    constructor() {
        effect(() => {
            const status = this.status();
            if (status) {
                addEventListener('scroll', (event) => this.onScroll(event), { passive: false });
            } else {
                removeEventListener('scroll', (event) => this.onScroll(event));
            }
        });
    }

    onScroll(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    toggle() {
        if (this.inProgress()) return;

        const status = this.status();
        this.status.set(!status);

        this.inProgress.set(true);
        setTimeout(() => {
            this.inProgress.set(false);
        }, this.PROGRESS_TIMEOUT);
    }
}
