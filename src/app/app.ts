import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from './core/header';
import {Sidebar} from './core/sidebar';
import {Footer} from './core/footer';
import {ExhibitPopup} from "./elements/exhibit_popup";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Sidebar, Footer, ExhibitPopup],
    styles: `
        .content {
            min-height: 100vh;
        }
    `,
    standalone: true,
    template: `
        <div class="container">
            <HeaderComp/>
            <SidebarComp/>
            <div class="content">
                <router-outlet/>
            </div>
            <FooterComp/>
            <ExhibitPopup/>
        </div>
    `
})
export class App {

}
