import { AfterViewInit, Component, effect, ElementRef, ViewChild } from '@angular/core';
import { SidebarInteractionService } from '../services/sidebar-interaction';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from "rxjs";

@Component({
    selector: 'SidebarComp',
    imports: [],
    styles: `
        .container {
            position: fixed;
            left: 0;
            width: 100vw;
            display: none;
            z-index: 9999;
            overflow: hidden;
            transition-duration: .3s;

            .content, .image {
                position: absolute;
                width: 50%;
                height: 100%;
                transition-duration: .6s;
                background: rgba(from var(--background-secondary) r g b / 60%);
                backdrop-filter: blur(5px);
                border-bottom: 1px solid var(--background-secondary);

                @media screen and (max-width: 600px) {
                }
            }

            .image {
                left: calc(50%);
                transition-delay: .2s;
                border-left: 1px solid var(--background-secondary);

                img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 50% 50%;
                    opacity: 0;
                    backdrop-filter: blur(5px);
                    transition-duration: .6s;
                    z-index: -3;

                    &.hover {
                        z-index: -2;
                        opacity: 1;
                    }
                }

                @media screen and (max-width: 800px) {
                    display: none !important;
                }
            }

            &:not(.sidebar-open) {
                .content, .image {
                    top: -100%;
                }
            }

            &.sidebar-open {
                .content, .image {
                    top: 0;
                }
            }

            &:not(.small) {
                top: var(--header-big-height);
                height: calc(100vh - var(--header-big-height));
            }

            &.small {
                top: var(--header-small-height);
                height: calc(100vh - var(--header-small-height));
            }
        }

        .content {
            padding: 32px 32px 100px;
            left: 0;
            border-right: 1px solid var(--background-secondary);
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: space-between;
            overflow: hidden;
            height: max-content;

            @media screen and (max-width: 600px) {
                overflow-y: scroll !important;
                overscroll-behavior: contain !important;
            }

            .block {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 20px;

                p {
                    width: 100%;
                    cursor: pointer;
                    overflow: hidden;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;

                    .text, .arrow-component {
                        transition: transform .6s var(--timeout), color .6s;
                    }

                    .text {
                        transform: translateX(-50vw);
                        font-size: 40px;
                        font-weight: bold;

                        @media screen and (max-width: 600px) {
                            font-size: 26px;
                            transform: translateX(-100vw);
                        }
                    }

                    .arrow-component {
                        position: relative;
                        transform: translateX(50vw);
                        overflow: visible;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        padding-right: 10px;

                        @media screen and (max-width: 600px) {
                            transform: translateX(100vw);
                        }

                        .arrow-circle {
                            position: absolute;
                            top: 50%;
                            right: 0;
                            transform: translateY(-50%);
                            height: 20px;
                            aspect-ratio: 1/1;
                            background: var(--background-accent);
                            border-radius: var(--br-100);
                            z-index: -1;
                        }
                    }

                    &:hover {
                        color: var(--background-primary);
                    }
                }

                &:has(p:hover) > p:not(:hover) {
                    color: var(--text-accent);

                    .arrow-circle {
                        filter: brightness(.9);
                    }
                }
            }

            .contacts {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 12px;

                a {
                    min-height: 46px;
                    padding: 0 18px;
                    cursor: pointer;
                    background: var(--text-primary);
                    color: var(--background-primary);
                    border-radius: var(--br-100);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    transition: transform .6s var(--timeout), background-color .3s, color .3s;
                    transform: translateY(200px);

                    &:hover {
                        background: var(--background-accent);
                        color: var(--background-primary);
                    }
                }
            }

            @media screen and (max-width: 800px) {
                width: 100vw !important;
            }
        }
    `,
    standalone: true,
    template: `
        <div class="container" #container>
            <div class="content">
                <div class="block" #content>
                    <p (click)="redirectTo('')" imageSrc="main.png" style="--timeout: 0s;">
                        <span class="text">Главная</span>
                        <span class="arrow-component">
                            <svg class="arrow-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="12"
                                 fill="none" viewBox="0 0 24 12"><path fill="currentColor"
                                                                       d="M0 5.113h20.644L17.577 2.04 18.804.804 24 6l-5.196 5.196-1.227-1.235 3.067-3.074H0z"></path></svg>
                            <span class="arrow-circle"></span>
                        </span>
                    </p>
                    <p (click)="redirectTo('blog/1')" imageSrc="blog.png" style="--timeout: .1s;">
                        <span class="text">Выставка</span>
                        <span class="arrow-component">
                            <svg class="arrow-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="12"
                                 fill="none" viewBox="0 0 24 12"><path fill="currentColor"
                                                                       d="M0 5.113h20.644L17.577 2.04 18.804.804 24 6l-5.196 5.196-1.227-1.235 3.067-3.074H0z"></path></svg>
                            <span class="arrow-circle"></span>
                        </span>
                    </p>
                    <p (click)="redirectTo('gallery')" imageSrc="gallery.png" style="--timeout: .2s;">
                        <span class="text">Коллекция</span>
                        <span class="arrow-component">
                            <svg class="arrow-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="12"
                                 fill="none" viewBox="0 0 24 12"><path fill="currentColor"
                                                                       d="M0 5.113h20.644L17.577 2.04 18.804.804 24 6l-5.196 5.196-1.227-1.235 3.067-3.074H0z"></path></svg>
                            <span class="arrow-circle"></span>
                        </span>
                    </p>
                </div>

                <div class="contacts" #contacts>
                    <a style="--timeout: .0s" (click)="redirectTo('blog/1')">Текущая</a>
                    <a style="--timeout: .1s" (click)="redirectTo('gallery')">Витрина</a>
                    <a style="--timeout: .2s" href="mailto:boriskiva67@gmail.com">Почта</a>
                </div>
            </div>

            <div class="image" #image>
                <img class="hover" src="sidebar/main.png" alt="">
                <img src="sidebar/blog.png" alt="">
                <img src="sidebar/gallery.png" alt="">
            </div>
        </div>
    `
})
export class Sidebar implements AfterViewInit {
    @ViewChild('container') container!: ElementRef<HTMLDivElement>;
    @ViewChild('image') imageContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('content') content!: ElementRef<HTMLDivElement>;
    @ViewChild('contacts') contacts!: ElementRef<HTMLDivElement>;

    currentSrc: string = 'sidebar/main.png';

    private routerSubscription!: Subscription;
    currentUrl: string = "";

    constructor(
        private sidebarInteractionService: SidebarInteractionService,
        private router: Router
    ) {
        effect(() => {
            const status = this.sidebarInteractionService.status();
            if (status) this.Open();
            else this.Close();
        });
    }

    ngAfterViewInit() {
        this.onScroll();
        addEventListener('scroll', () => this.onScroll());

        const links = this.content.nativeElement.querySelectorAll('p');
        links.forEach(link => {
            link.addEventListener('mouseover', () => {
                const src = `sidebar/${ link.getAttribute('imageSrc') ?? 'main.png' }`;
                if (this.currentSrc === src) return;

                const images = this.imageContainer.nativeElement.querySelectorAll('img');
                const current = this.getImage(images, this.currentSrc)!;
                const next = this.getImage(images, src)!;
                this.currentSrc = src;

                next.classList.add('hover');
                current.classList.remove('hover');
            });
        });

        this.routerSubscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.currentUrl = event.url;
            this.onScroll();
        });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
        removeEventListener('scroll', this.onScroll)
    }

    redirectTo(url: string) {
        window.scrollTo(0, 0);
        this.router.navigateByUrl(url === '' ? '/' : `/${url}`);
        this.sidebarInteractionService.toggle();
    }

    getImage(images: NodeListOf<HTMLImageElement>, src: string) {
        for (let i = 0; i < images.length; i++)
            if ((images.item(i).src.split('/').slice(3).join('/')) === src)
                return images.item(i);
        return null;
    }

    Open() {
        if (this.container === undefined) return;
        this.container.nativeElement.style.display = 'flex';

        setTimeout(() => {
            this.container.nativeElement.classList.add('sidebar-open');
        }, 10);
        setTimeout(() => {
            const links = this.content.nativeElement.querySelectorAll('p');
            const contacts = this.contacts.nativeElement.querySelectorAll('a');
            contacts.forEach(contact => contact.style.transform = 'translateY(0)');
            links.forEach(link => {
                const link_text = link.querySelectorAll('span').item(0);
                const link_arrow = link.querySelectorAll('span').item(1);

                link_text.style.transform = 'translateX(0)';
                link_arrow.style.transform = 'translateX(0)';
            });
        }, 610);
    }

    Close() {
        if (this.container === undefined) return;

        const links = this.content.nativeElement.querySelectorAll('p');
        const contacts = this.contacts.nativeElement.querySelectorAll('a');
        contacts.forEach(contact => contact.style.transform = 'translateY(200px)');
        links.forEach(link => {
            const link_text = link.querySelectorAll('span').item(0);
            const link_arrow = link.querySelectorAll('span').item(1);

            link_text.style.transform = '';
            link_arrow.style.transform = '';
        });
        setTimeout(() => {
            this.container.nativeElement.classList.remove('sidebar-open');
        }, 600);
        setTimeout(() => {
            this.container.nativeElement.style.display = 'none';
        }, 1300);
    }

    onScroll() {
        if (this.container === undefined) return;

        const top = window.scrollY;
        if (this.currentUrl != '/' || top > 0)
            this.container.nativeElement.classList.add('small');
        else
            this.container.nativeElement.classList.remove('small');
    }
}
