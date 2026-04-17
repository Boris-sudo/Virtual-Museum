import { AfterViewInit, Component, effect, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationsService } from '../../../services/animations';
import { PreviousExpeditionsService } from '../../../services/previous-expeditions';
import { Exhibit } from "../../../elements/exhibit";
import { BlogModel } from "../../../models/blog";

@Component({
    selector: 'app-blog',
    imports: [
        Exhibit
    ],
    templateUrl: './blog.html',
    standalone: true,
    styleUrl: './blog.css'
})
export class Blog implements AfterViewInit, OnDestroy {
    blog!: BlogModel;

    blogs = signal<BlogModel[]>([]);

    public blogLoaded = signal<boolean>(false);
    private revealObserver: IntersectionObserver | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private blogsService: PreviousExpeditionsService,
        private animationsService: AnimationsService
    ) {
        effect(() => {
            const blogs = this.blogsService.blogs();
            this.blogs.set(blogs);
            if (blogs.length > 0) this.getBlog();
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.initRevealObserver();
            this.initTiltCards();
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

    private initTiltCards() {
        document.querySelectorAll('.exhibit-item').forEach((card) => {
            const el = card as HTMLElement;
            el.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                el.style.transform = `perspective(1000px) rotateX(${ rotateX }deg) rotateY(${ rotateY }deg) scale(1.02)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }

    getBlog() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        const blog = this.blogsService.getBlog(id);
        if (blog === undefined)
            this.router.navigate(['']);
        this.blog = blog!;
        this.blogLoaded.set(true);

        setTimeout(() => {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#chapter-')) {
                const chapterIndex = parseInt(hash.replace('#chapter-', ''), 10);
                if (!isNaN(chapterIndex)) {
                    this.scrollToChapter(chapterIndex);
                }
            }
        }, 300);
    }

    scrollToChapter(index: number) {
        const element = document.getElementById(`chapter-${ index }`);
        if (element) {
            setTimeout(() => {
                const headerOffset = 160;
                const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }, 100);
        }
    }

    navigate(url: string) {
        window.scrollTo({ top: 0 });
        setTimeout(() => {
            this.router.navigateByUrl(url.startsWith('/') ? url : `/${ url }`);
        }, 50);
    }
}
