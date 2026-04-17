import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    OnDestroy,
    QueryList,
    signal,
    ViewChildren
} from '@angular/core';
import { Router } from '@angular/router';
import { BlogModel } from '../../models/blog';
import { AnimationsService } from '../../services/animations';
import { PreviousExpeditionsService } from '../../services/previous-expeditions';

@Component({
    selector: 'app-blogs',
    imports: [],
    templateUrl: './blogs.html',
    standalone: true,
    styleUrl: './blogs.css'
})
export class Blogs implements AfterViewInit, OnDestroy {
    @ViewChildren('visible') visibleElements!: QueryList<ElementRef>;

    blogs = signal<BlogModel[]>([]);
    private revealObserver: IntersectionObserver | null = null;

    constructor(
        private router: Router,
        private blogsService: PreviousExpeditionsService,
        private animationsService: AnimationsService
    ) {
        effect(() => {
            this.blogs.set(this.blogsService.blogs());
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.initRevealObserver();
        }, 100);
    }

    ngOnDestroy() {
        if (this.revealObserver) {
            this.revealObserver.disconnect();
        }
        this.animationsService.destroyObserver();
    }

    private initRevealObserver() {
        if (this.revealObserver) {
            this.revealObserver.disconnect();
        }

        this.revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        this.revealObserver?.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.reveal, .slide-left, .slide-right').forEach((el) => {
            this.revealObserver?.observe(el);
        });
    }

    navigate(url: string) {
        window.scrollTo({ top: 0 });
        setTimeout(() => {
            this.router.navigateByUrl(url.startsWith('/') ? url : `/${ url }`);
        }, 50);
    }
}
