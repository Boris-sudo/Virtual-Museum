import { AfterViewInit, Component, computed, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ExhibitModel } from '../../models/exhibit.model';
import { ExhibitService } from '../../services/exhibit';
import { PreviousExpeditionsService } from '../../services/previous-expeditions';

interface OverviewCard {
    title: string;
    description: string;
}

interface PlannedExhibition {
    status: string;
    title: string;
    description: string;
}

interface ExhibitionRoom {
    phase: string;
    title: string;
    description: string;
    detail: string;
    link: string;
}

interface FeaturedArtifactDefinition {
    id: number;
    section: string;
    period: string;
    description: string;
}

interface FeaturedArtifactCard extends FeaturedArtifactDefinition {
    exhibit?: ExhibitModel;
}

@Component({
    selector: 'HomePage',
    imports: [],
    templateUrl: './home.html',
    standalone: true,
    styleUrl: './home.css'
})
export class Home implements AfterViewInit, OnDestroy {
    private revealObserver: IntersectionObserver | null = null;

    readonly exhibitionRooms: ExhibitionRoom[] = [
        {
            phase: 'Зал I',
            title: 'Кремли, соборы и крепостные ансамбли',
            description: 'Первый зал рассказывает нам о Архитектуре Кремлей, Монастырей и Крепостных ансамблей.',
            detail: 'Кремли, монастыри и фортификация',
            link: 'blog/1#chapter-1',
        },
        {
            phase: 'Зал II',
            title: 'Влияние огнестрельного оружия',
            description: 'Второй зал о том, как появление огнестрельного оружия повлияло на архитектуру в Руси.',
            detail: 'Оружие, форты, крепости',
            link: 'blog/1#chapter-2',
        },
        {
            phase: 'Зал III',
            title: 'Фреска, икона и собранный образ мира',
            description: 'Этот зал представляет уникальные фрески, иконы и другие художественные произведения, которые показывают развитие искусства в разных исторических периодах.',
            detail: 'Феофан, Рублев и Дионисий',
            link: 'blog/1#chapter-3',
        },
        {
            phase: 'Зал IV',
            title: 'Монументальная живопись и иконопись',
            description: 'Этот зал представляет знаменитые монументальные живописи и иконописи, созданные в разные исторические периоды.',
            detail: 'Феофан, Рублев и Дионисий',
            link: 'blog/1#chapter-4',
        },
    ];

    readonly plannedExhibitions: PlannedExhibition[] = [
        {
            status: 'Скоро',
            title: 'Повседневность посадов',
            description:
                'От ремесленных дворов и торга до устройства русского города как усадебного пространства.'
        },
        {
            status: 'В разработке',
            title: 'Власть и церемония',
            description:
                'Княжеский двор, придворный ритуал и то, как соборы и палаты превращались в политическую сцену.'
        },
        {
            status: 'В разработке',
            title: 'Граница и путь',
            description:
                'Западные рубежи, оборонительные линии и торговые дороги, связывавшие Русь с Европой и степью.'
        }
    ];

    private readonly featuredArtifactDefinitions: FeaturedArtifactDefinition[] = [
        {
            id: 7,
            section: 'Архитектура столицы',
            period: 'Конец XV века',
            description:
                'Объект, с которого удобно начать разговор о новой Москве: крепость уже строится как государственный образ.'
        },
        {
            id: 20,
            section: 'Иконопись',
            period: '1420-е годы',
            description:
                'Точка тишины внутри всей экспозиции: образ согласия и духовного единства после долгого времени распада.'
        },
        {
            id: 1,
            section: 'Военное дело',
            period: 'XVI век и предыстория изменений',
            description:
                'Предмет, который объясняет, почему крепостные стены становятся ниже, толще и намного умнее по конструкции.'
        }
    ];

    readonly featuredExhibition = computed(() =>
        this.previousExpeditionsService
            .blogs()
            .find((blog) => blog.content.some((block) => block.data.some((data) => data.text.trim().length > 0)))
    );

    readonly exhibitCount = computed(() => this.exhibitService.exhibits().length || 22);

    readonly featuredArtifacts = computed<FeaturedArtifactCard[]>(() => {
        const exhibits = this.exhibitService.exhibits();

        return this.featuredArtifactDefinitions
            .map((item) => {
                const exhibit = exhibits.find((e) => e.id === item.id);
                return {
                    ...item, exhibit: exhibit || {
                        id: item.id,
                        name: item.section,
                        src: ['img_20.png'],
                        description: item.description
                    }
                };
            });
    });

    readonly primaryArtifact = computed(() => this.featuredArtifacts()[0]);

    readonly secondaryArtifacts = computed(() => this.featuredArtifacts().slice(1, 3));

    readonly allArtifacts = computed(() => this.featuredArtifacts());

    constructor(
        private previousExpeditionsService: PreviousExpeditionsService,
        private exhibitService: ExhibitService,
        private router: Router
    ) {
    }

    ngAfterViewInit() {
        this.initRevealObserver();

        document.querySelectorAll('.counter').forEach((el) => {
            this.initCounter(el as HTMLElement);
        });

        document.querySelectorAll('.tilt-card').forEach((card) => {
            this.initTiltEffect(card as HTMLElement);
        });
    }

    ngOnDestroy() {
        if (this.revealObserver) {
            this.revealObserver.disconnect();
        }
    }

    private initRevealObserver() {
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

        document.querySelectorAll('.reveal, .slide-left, .slide-right, .scale-in').forEach((el) => {
            this.revealObserver?.observe(el);
        });
    }

    private initCounter(element: HTMLElement) {
        const target = parseInt(element.getAttribute('data-target') || '0', 10);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.animateCounter(element, target);
                        observer.unobserve(element);
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(element);
    }

    private animateCounter(element: HTMLElement, target: number) {
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const current = Math.ceil(easeOut * target);

            element.textContent = current.toString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target.toString();
            }
        };

        requestAnimationFrame(animate);
    }

    private initTiltEffect(card: HTMLElement) {
        card.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${ rotateX }deg) rotateY(${ rotateY }deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    scrollTo(id: string) {
        const element = document.getElementById(id);
        if (!element) return;

        const top = element.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    }

    openExhibition(id?: number) {
        this.navigate(`blog/${ id ?? this.featuredExhibition()?.id ?? 1 }`);
    }

    openExhibit(exhibit: ExhibitModel, element: any) {
        this.exhibitService.exhibit_bounds.set(element.getBoundingClientRect());
        this.exhibitService.exhibit_popup.set(exhibit);
    }

    navigate(url: string) {
        window.scrollTo({ top: 0 });
        this.router.navigateByUrl(url.startsWith('/') ? url : `/${ url }`);
    }
}
