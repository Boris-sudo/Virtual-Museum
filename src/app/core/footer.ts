import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'FooterComp',
    imports: [],
    styles: `
        .container {
            padding: 32px;
            background: var(--text-primary);
            color: var(--background-primary);
            display: flex;
            flex-direction: column;
            gap: 32px;

            @media screen and (max-width: 700px) {
                padding: 24px 20px;
            }
        }

        .top {
            width: 100%;
            max-width: 1440px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) repeat(2, minmax(220px, 0.45fr));
            gap: 24px;

            @media screen and (max-width: 1000px) {
                grid-template-columns: 1fr;
            }
        }

        .brand, .links, .contact {
            padding: 24px;
            border-radius: 28px;
            background: rgba(from var(--background-primary) r g b / 0.06);
            border: 1px solid rgba(from var(--background-primary) r g b / 0.1);
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .eyebrow {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(from var(--background-primary) r g b / 0.55);
        }

        h2 {
            font-family: var(--ff-tinos), serif;
            font-size: clamp(2rem, 4vw, 3.6rem);
            line-height: 0.95;
            letter-spacing: -0.04em;
            text-wrap: balance;
        }

        p, a, button, span {
            font-size: 16px;
            line-height: 1.6;
            color: inherit;
        }

        .links button {
            width: fit-content;
            border: none;
            background: transparent;
            padding: 0;
            cursor: pointer;
            font-size: 18px;
            font-weight: 700;
            transition: color .3s ease, transform .3s ease;

            &:hover {
                color: var(--background-accent);
                transform: translateX(4px);
            }
        }

        .contact a {
            font-size: 20px;
            font-weight: 700;
        }

        .bottom {
            width: 100%;
            max-width: 1440px;
            margin: 0 auto;
            padding-top: 24px;
            border-top: 1px solid rgba(from var(--background-primary) r g b / 0.12);
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            flex-wrap: wrap;

            span {
                color: rgba(from var(--background-primary) r g b / 0.65);
            }
        }
    `,
    standalone: true,
    template: `
        <div class="container">
            <div class="top">
                <div class="brand">
                    <p class="eyebrow">Virtual Museum</p>
                    <h2>Виртуальный музей истории Руси</h2>
                    <p>
                        Сейчас в музее работает одна выставка о Руси XIII–XV веков, коллекция
                        экспонатов и структура для следующих трёх маршрутов.
                    </p>
                </div>

                <div class="links">
                    <p class="eyebrow">Навигация</p>
                    <button type="button" (click)="redirectTo('')">Главная</button>
                    <button type="button" (click)="redirectTo('blog/1')">Выставка</button>
                    <button type="button" (click)="redirectTo('gallery')">Коллекция</button>
                </div>

                <div class="contact">
                    <p class="eyebrow">Связь</p>
                    <a href="mailto:boriskiva67@gmail.com">vm-ru@mail.com</a>
                    <p>Мы отвечаем в течении одного рабочего дня, все письма приходят на почту.</p>
                </div>
            </div>

            <div class="bottom">
                <span>© Virtual Museum</span>
            </div>
        </div>
    `
})
export class Footer {
    constructor(private router: Router) {
    }

    redirectTo(url: string) {
        window.scrollTo({ top: 0 });
        this.router.navigateByUrl(url === '' ? '/' : `/${ url }`);
    }
}
