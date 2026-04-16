import { Component, computed } from '@angular/core';
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
export class Gallery {
    private readonly sectionDefinitions: CollectionSectionDefinition[] = [
        {
            eyebrow: 'Архитектура',
            title: 'Кремли, соборы и крепостные ансамбли',
            description:
                'Эта часть коллекции показывает, как менялся облик города в эпоху собирания Руси: от монастырей-сторожей до новых оборонительных центров.',
            ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        },
        {
            eyebrow: 'Военное дело',
            title: 'Оружие и логика новой обороны',
            description:
                'Небольшой раздел, который помогает понять, почему архитектура крепостей меняется вместе с появлением огнестрельного оружия.',
            ids: [1]
        },
        {
            eyebrow: 'Иконопись',
            title: 'Фреска, образ и свет внутри храма',
            description:
                'От новгородской монументальной живописи к Рублеву и Дионисию: здесь собраны предметы, связанные с визуальным языком эпохи.',
            ids: [14, 15, 16, 17, 18, 19, 20, 21, 22]
        }
    ];

    readonly exhibits = computed(() => this.exhibitService.exhibits());

    readonly collectionSections = computed<CollectionSection[]>(() => {
        const exhibits = this.exhibitService.exhibits();

        return this.sectionDefinitions
            .map((section) => ({
                ...section,
                exhibits: section.ids
                    .map((id) => exhibits.find((exhibit) => exhibit.id === id))
                    .filter((item): item is ExhibitModel => item !== undefined)
            }))
            .filter((section) => section.exhibits.length > 0);
    });

    constructor(
        private exhibitService: ExhibitService,
        private router: Router
    ) {}

    openExhibit(exhibit: ExhibitModel, element: HTMLElement) {
        this.exhibitService.exhibit_bounds.set(element.getBoundingClientRect());
        this.exhibitService.exhibit_popup.set(exhibit);
    }

    navigate(url: string) {
        window.scrollTo({ top: 0 });
        this.router.navigateByUrl(url.startsWith('/') ? url : `/${url}`);
    }

    excerpt(text: string) {
        const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return plainText.length > 180 ? `${plainText.slice(0, 180).trim()}...` : plainText;
    }
}
