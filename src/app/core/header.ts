import { AfterViewInit, Component, effect, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { SidebarInteractionService } from '../services/sidebar-interaction';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from "rxjs";

@Component({
    selector: 'HeaderComp',
    imports: [],
    styles: `
        .container {
            position:            fixed;
            width:               100%;
            height:              var(--header-big-height);
            display:             flex;
            flex-direction:      row;
            justify-content:     space-between;
            align-items:         center;
            transition-duration: .3s;
            padding:             0 32px;
            z-index:             10000;
            border-bottom:       1px solid transparent;
            overflow:            hidden;

            @media screen and (max-width: 600px) {
                padding: 10px 16px;
            }

            .logo {
                height:         100%;
                display:        flex;
                flex-direction: row;
                align-items:    center;
                color:          var(--background-primary);

                img {
                    transition-duration: .3s;
                    cursor:              pointer;
                    user-select:         none;
                    height:              100%;
                }

                p {
                    transition-duration: .3s;
                    font-weight:         700;
                    cursor:              pointer;
                    user-select:         none;
                }
            }

            .menu-icon {
                display:        flex;
                flex-direction: row;
                align-items:    center;
                gap:            16px;
                padding:        0 10px;
                height:         52px;
                background:     var(--background-secondary);
                border-radius:  var(--br-8);
                cursor:         pointer;
                transition:     .5s cubic-bezier(.3, .86, .36, .95);
                animation:      menu-icon-appear .5s forwards ease-in-out;
                opacity:        0.5;
                color:          var(--text-primary);

                @media screen and (max-width: 600px) {
                    padding: 0 8px;
                    height:  40px;
                    gap:     10px;

                    &:hover {
                        padding: 0 10px !important;
                        gap:     16px !important;
                    }
                }

                p {
                    font-weight: 500;
                    user-select: none;
                    font-size:   16px;

                    @media screen and (max-width: 600px) {
                        font-size: 14px;
                    }
                }

                .lines {
                    height:          100%;
                    display:         flex;
                    flex-direction:  column;
                    gap:             6px;
                    justify-content: center;

                    .line {
                        transition:    .5s cubic-bezier(.3, .86, .36, .95);
                        width:         36px;
                        height:        2px;
                        border-radius: var(--br-100);
                        background:    var(--text-secondary);
                    }
                }

                &:hover {
                    padding:    0 25px;
                    gap:        24px;
                    background: var(--background-neutral);
                    color:      var(--text-primary);

                    .lines > .line {
                        background: var(--text-primary);
                    }
                }
            }

            &::after {
                content:             '';
                background:          rgba(from var(--background-secondary) r g b / 60%);
                backdrop-filter:     blur(5px);
                position:            absolute;
                left:                0;
                bottom:              -100%;
                width:               100%;
                height:              100%;
                z-index:             -1;
                transition-duration: .6s;
            }

            &.sidebar-opened {
                border-bottom-color: var(--background-secondary);

                &::after {
                    bottom: 0;
                }

                .menu-icon {
                    color:      var(--background-secondary);
                    background: var(--text-secondary);

                    .lines > .line {
                        background: var(--background-secondary);
                    }
                }

                .menu-icon:hover {
                    color: var(--background-primary);

                    .lines > .line {
                        background: var(--background-primary);
                    }
                }
            }

            &.bg {
                background-color: var(--background-primary);
                border-bottom:    1px solid var(--background-secondary);
            }

            &:not(.small) {
                .logo {
                    img {
                        height: 60px;

                        @media screen and (max-width: 600px) {
                            height: 50px;
                        }
                    }
                }
            }

            &.small {
                height:           var(--header-small-height) !important;
                background-color: var(--background-primary);
                border-bottom:    1px solid var(--background-secondary);

                .logo {
                    img {
                        height: 45px;

                        @media screen and (max-width: 600px) {
                            height: 40px;
                        }
                    }
                }
            }
        }
    `,
    standalone: true,
    template: `
            <div class="container" #container>
            <div (click)="redirectTo('/')" class="logo">
                <img src="logo.svg" style="filter: invert(1)" alt="Логотип виртуального музея">
            </div>
            <div (click)="interactionToggle()" class="menu-icon" #menuIcon>
                <p #menuIconText>меню</p>
                <div class="lines">
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
            </div>
        </div>
    `
})
export class Header implements AfterViewInit, OnDestroy {
    @ViewChild('container') container!: ElementRef<HTMLDivElement>;
    @ViewChild('menuIcon') menuIcon!: ElementRef<HTMLDivElement>;
    @ViewChild('menuIconText') menuIconText!: ElementRef<HTMLParagraphElement>;

    private isHome: boolean = false;

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
        addEventListener('scroll', this.onScroll);
        this.routerSubscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.currentUrl = event.url;
            this.onScroll();
        });
        this.onScroll();
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
        removeEventListener('scroll', this.onScroll)
    }

    interactionToggle(): void {
        this.sidebarInteractionService.toggle();
    }

    redirectTo(url: string) {
        window.scrollTo(0, 0);
        setTimeout(() => {
            this.router.navigateByUrl(url);
        });
    }

    Open() {
        if (this.menuIconText === undefined) return;

        this.menuIconText.nativeElement.innerHTML = 'закрыть';
        this.container.nativeElement.classList.add('sidebar-opened');
    }

    Close() {
        if (this.menuIconText === undefined) return;


        setTimeout(() => {
            this.menuIconText.nativeElement.innerHTML = 'меню';
            this.container.nativeElement.classList.remove('sidebar-opened');
        }, 600);
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
