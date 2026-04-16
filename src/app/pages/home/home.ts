import { Component, computed } from '@angular/core';
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
export class Home {
    readonly overviewCards: OverviewCard[] = [
        {
            title: 'Архитектура власти',
            description:
                'От первых каменных соборов до нового Московского Кремля, который уже мыслится как столица собирающегося государства.'
        },
        {
            title: 'Город как крепость',
            description:
                'Монастыри-сторожи, кремли и перестройка обороны в эпоху, когда на полях сражений появляются ручницы и пищали.'
        },
        {
            title: 'Свет внутри храма',
            description:
                'Феофан Грек, Андрей Рублев и Дионисий показывают, как живопись становится языком согласия, памяти и духовной силы.'
        }
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
            .find((blog) => blog.content.some((block) => block.data.some(data => data.text.trim().length > 0)))
    );

    readonly exhibitCount = computed(() => this.exhibitService.exhibits().length || 22);

    readonly featuredArtifacts = computed<FeaturedArtifactCard[]>(() => {
        const exhibits = this.exhibitService.exhibits();

        return this.featuredArtifactDefinitions
            .map((item) => ({
                ...item,
                exhibit: exhibits.find((exhibit) => exhibit.id === item.id)
            }))
            .filter((item) => item.exhibit !== undefined);
    });

    constructor(
        private previousExpeditionsService: PreviousExpeditionsService,
        private exhibitService: ExhibitService,
        private router: Router
    ) {}

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
        this.navigate(`blog/${id ?? this.featuredExhibition()?.id ?? 1}`);
    }

    openExhibit(exhibit: ExhibitModel, element: HTMLElement) {
        this.exhibitService.exhibit_bounds.set(element.getBoundingClientRect());
        this.exhibitService.exhibit_popup.set(exhibit);
    }

    navigate(url: string) {
        window.scrollTo({ top: 0 });
        this.router.navigateByUrl(url.startsWith('/') ? url : `/${url}`);
    }
}
