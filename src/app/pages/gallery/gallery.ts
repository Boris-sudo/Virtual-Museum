import { AfterViewInit, Component, computed, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ExhibitModel } from '../../models/exhibit.model';
import { ExhibitService } from '../../services/exhibit';

interface CollectionSectionDefinition {
    eyebrow: string;
    title: string;
    description: string;
    ids: number[];
}

interface CollectionSection extends CollectionSectionDefinition {
    exhibits: ExhibitModel[];
}

@Component({
    selector: 'app-gallery',
    imports: [],
    templateUrl: './gallery.html',
    standalone: true,
    styleUrl: './gallery.css'
})
export class Gallery implements AfterViewInit, OnDestroy {
    private revealObserver: IntersectionObserver | null = null;

    readonly activeCategory = signal<string>('all');

    readonly sectionDefinitions: CollectionSectionDefinition[] = [
        {
            eyebrow: 'Кремли, монастыри, крепости',
            title: 'Архитектура Московской Руси',
            description:
                'Кремли, монастыри и крепости — каменное оружие государства: от стен Московского Кремля до крепостей северо-запада.',
            ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 30, 31, 32, 33]
        },
        {
            eyebrow: 'Оружие и оборона',
            title: 'Военное дело и фортификация',
            description:
                'Ручницы, крепостные стены и башни: как огнестрельное оружие изменило облик русской обороны.',
            ids: [1, 26, 27, 28, 29]
        },
        {
            eyebrow: 'Иконопись и фрески',
            title: 'Образ и свет внутри храма',
            description:
                'От Феофана Грека и Андрея Рублёва до Дионисия: развитие иконописи и монументальной живописи XV–XVI веков.',
            ids: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
        },
    ];

    readonly exhibits = computed(() => this.exhibitService.exhibits());

    readonly collectionSections = computed<CollectionSection[]>(() => {
        const exhibits = this.exhibitService.exhibits();

        return this.sectionDefinitions
            .map((section) => {
                const sectionExhibits: ExhibitModel[] = [];

                section.ids.forEach(id => {
                    const existingExhibit = exhibits.find((e) => e.id === id);
                    if (existingExhibit) {
                        sectionExhibits.push(existingExhibit);
                    } else if (exhibits.length === 0) {
                        sectionExhibits.push({
                            id,
                            name: this.getExhibitName(id),
                            src: ['img_20.png'],
                            description: this.getExhibitDescription(id)
                        });
                    }
                });

                return {
                    ...section,
                    exhibits: sectionExhibits
                };
            })
            .filter((section) => section.exhibits.length > 0);
    });

    readonly allExhibits = computed((): ExhibitModel[] => {
        const exhibits = this.exhibitService.exhibits();
        if (exhibits.length === 0) {
            const fallbacks: ExhibitModel[] = [];
            this.sectionDefinitions.forEach(section => {
                section.ids.forEach(id => {
                    fallbacks.push({
                        id,
                        name: this.getExhibitName(id),
                        src: ['img_20.png'],
                        description: this.getExhibitDescription(id)
                    });
                });
            });
            return fallbacks;
        }
        return exhibits;
    });

    readonly filteredExhibits = computed(() => {
        const category = this.activeCategory();
        const exhibits = this.allExhibits();

        if (category === 'all') return exhibits;

        const section = this.sectionDefinitions.find(s => s.eyebrow.toLowerCase() === category.toLowerCase());
        if (!section) return exhibits;

        return exhibits.filter(e => section.ids.includes(e.id));
    });

    readonly categories = computed(() => {
        return [
            { key: 'all', label: 'Все' },
            { key: 'Кремли, монастыри, крепости', label: 'Архитектура' },
            { key: 'Оружие и оборона', label: 'Оборона' },
            { key: 'Иконопись и фрески', label: 'Иконопись' }
        ];
    });

    private getExhibitName(id: number): string {
        const names: Record<number, string> = {
            1: 'Самопалы или ручницы',
            2: 'Богородице-Смоленский Новодевичий монастырь',
            3: 'Донской монастырь',
            4: 'Стиль Высокого Ренессанса',
            5: 'План Московского Кремля',
            6: 'Миланская крепость',
            7: 'Аристотель Фиораванти',
            8: 'Нижегородский кремль',
            9: 'Тульский кремль',
            10: 'Европейские улицы в XV веке',
            11: 'Новгородские церкви XIV–XV веков',
            12: 'Храм Фёдора Стратилата на Ручью',
            13: 'Псковские храмы XV века',
            14: 'Иконопись XV века',
            15: 'Феофан Грек',
            16: 'Росписи храмов в Новгороде',
            17: 'Нетварный Фаворский свет',
            18: 'Макарий Египетский',
            19: 'Андрей Рублёв',
            20: 'Икона «Святая Троица»',
            21: 'Фрески Страшного суда',
            22: 'Дионисий',
            23: 'Застройка древнерусских городов',
            24: 'Церковь Спаса на Ковалеве',
            25: 'Церковь Успения на Волотовом поле',
            26: 'Средневековая крепость',
            27: 'Орудия на колёсных лафетах',
            28: 'Конструкции новых крепостных стен',
            29: 'Новая конструкция башен',
            30: 'Ивангород',
            31: 'Копорская крепость',
            32: 'Орешек / Шлиссельбург',
            33: 'Крепость Ям'
        };
        return names[id] || `Экспонат ${ id }`;
    }

    private getExhibitDescription(id: number): string {
        const descriptions: Record<number, string> = {
            1: 'Ручницы и пищали — раннее огнестрельное оружие Руси XIV–XV веков.',
            2: 'Смоленский Новодевичий монастырь — оборонительная обитель на западных рубежах.',
            3: 'Донской монастырь — древнейшая московская обитель.',
            4: 'Влияние итальянского Ренессанса на русскую архитектуру.',
            5: 'План-схема Московского Кремля — сердца государства.',
            6: 'Миланская крепость как образец европейского фортификационного искусства.',
            7: 'Аристотель Фиораванти — итальянский зодчий Московского Кремля.',
            8: 'Нижегородский кремль — каменная цитадель на Волге.',
            9: 'Тульский кремль — южный форпост Московского государства.',
            10: 'Городская застройка Европы XV века — улицы, площади, дома.',
            11: 'Новгородские церкви XIV–XV веков — северное зодчество.',
            12: 'Храм Фёдора Стратилата — новгородская архитектура XIV века.',
            13: 'Псковские храмы — особый стиль древнерусской архитектуры.',
            14: 'Развитие иконописи в XV веке — от традиции к новым формам.',
            15: 'Феофан Грек — мастер монументальной живописи, работавший в Новгороде и Москве.',
            16: 'Росписи новгородских храмов — фресковая живопись XIV–XV веков.',
            17: 'Богословие Фаворского света в иконописи.',
            18: 'Житие преподобного Макария Египетского в русской традиции.',
            19: 'Андрей Рублёв — великий иконописец, создатель «Троицы».',
            20: '«Святая Троица» — главная икона русской культуры.',
            21: 'Фрески Страшного суда — тема в монументальной живописи.',
            22: 'Дионисий — мастер иконописи конца XV – начала XVI века.',
            23: 'Планировка и застройка древнерусских городов.',
            24: 'Церковь Спаса на Ковалеве — памятник новгородской архитектуры.',
            25: 'Церковь Успения на Волотовом поле — шедевр фресковой живописи.',
            26: 'Средневековая крепость — принципы крепостного строительства.',
            27: 'Орудия на лафетах — развитие артиллерии XV–XVI веков.',
            28: 'Новые конструкции крепостных стен с учётом огнестрельного оружия.',
            29: 'Башенные конструкции в системе крепостной обороны.',
            30: 'Ивангород — крепость на границе с Ливонией.',
            31: 'Копорская крепость — западный форпост Новгорода.',
            32: 'Орешек / Шлиссельбург — крепость у истока Невы.',
            33: 'Крепость Ям — северо-западный рубеж Московского государства.'
        };
        return descriptions[id] || 'Уникальный исторический экспонат эпохи средневековой Руси.';
    }

    constructor(
        private exhibitService: ExhibitService,
        private router: Router
    ) {
    }

    ngAfterViewInit() {
        this.initRevealObserver();
    }

    ngOnDestroy() {
        if (this.revealObserver) {
            this.revealObserver.disconnect();
        }
    }

    setCategory(category: string) {
        this.activeCategory.set(category);
        setTimeout(() => this.initRevealObserver(), 100);
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
            if (!el.classList.contains('active')) {
                this.revealObserver?.observe(el);
            }
        });
    }

    openExhibit(exhibit: ExhibitModel, element: any) {
        this.exhibitService.exhibit_bounds.set(element.getBoundingClientRect());
        this.exhibitService.exhibit_popup.set(exhibit);
    }

    navigate(url: string) {
        window.scrollTo({ top: 0 });
        this.router.navigateByUrl(url.startsWith('/') ? url : `/${ url }`);
    }

    excerpt(text: string) {
        const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return plainText.length > 120 ? `${ plainText.slice(0, 120).trim() }...` : plainText;
    }
}
