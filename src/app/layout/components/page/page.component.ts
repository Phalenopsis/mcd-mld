import { Component } from '@angular/core';
import { AsideComponent } from '../aside/aside.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [AsideComponent, HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {

}
