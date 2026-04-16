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
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogFilterModel } from '../../models/blog-filter.model';
import { BlogModel } from '../../models/blog';
import { BlogsFilterPipe } from '../../pipes/blogs-filter-pipe';
import { AnimationsService } from '../../services/animations';
import { PreviousExpeditionsService } from '../../services/previous-expeditions';

@Component({
    selector: 'app-blogs',
    imports: [
        FormsModule,
        BlogsFilterPipe,
    ],
    templateUrl: './blogs.html',
    standalone: true,
    styleUrl: './blogs.css'
})
export class Blogs implements AfterViewInit, OnDestroy {
    @ViewChildren('visible') visibleElements!: QueryList<ElementRef>;

    blogs = signal<BlogModel[]>([]);
    blogFilter: BlogFilterModel = {
        name: '',
        year: 'all',
        tags: [],
        min_difficulty: '1',
        max_difficulty: '10',
    };

    years: number[] = [];
    difficulties: number[] = [];

    constructor(
        private router: Router,
        private blogsService: PreviousExpeditionsService,
        private animationsService: AnimationsService
    ) {
        for (let i = 1; i <= 10; i++) this.difficulties.push(i);

        effect(() => {
            this.blogs.set(this.blogsService.blogs());
        });
        effect(() => {
            const blogs = this.blogs();
            if (blogs.length === 0) return;
            for (const blog of blogs) {
                const year = Number(blog.date.split('.')[2]);
                this.years.push(year);
            }
            this.years = [...new Set(this.years)];
        });
    }

    ngAfterViewInit() {
        this.visibleElements.forEach(element => this.animationsService.addObservableElement(element.nativeElement));
    }

    ngOnDestroy() {
        this.animationsService.destroyObserver();
    }

    redirectTo(url: string) {
        window.scrollTo({
            top: 0
        });
        this.router.navigate([url]);
    }

    redirectToId(id: number) {
        this.redirectTo(`blog/${ id }`);
    }

    isFilterEmpty() {
        return this.blogFilter.max_difficulty === '10' &&
            this.blogFilter.min_difficulty === '1' &&
            this.blogFilter.name === '' &&
            this.blogFilter.year === 'all';
    }

    resetFilters() {
        this.blogFilter = {
            name: '',
            year: 'all',
            tags: [],
            min_difficulty: '1',
            max_difficulty: '10',
        };
    }

    min(a: any, b: any) {
        return a < b ? a : b;
    }

    max(a: any, b: any) {
        return a < b ? b : a;
    }

    protected readonly Number = Number;
}

