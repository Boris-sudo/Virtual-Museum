import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    OnDestroy,
    QueryList,
    Renderer2,
    signal,
    ViewChild,
    ViewChildren
} from '@angular/core';
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

    private contentLoaded = signal<boolean>(false);
    public blogLoaded = signal<boolean>(false);

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
        this.contentLoaded.set(true);
    }

    ngOnDestroy() {
        this.animationsService.destroyObserver();
    }

    getBlog() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        const blog = this.blogsService.getBlog(id);
        if (blog === undefined)
            this.router.navigate(['futures']);
        this.blog = blog!;
        this.blogLoaded.set(true);
    }
}

