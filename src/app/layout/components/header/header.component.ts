import { Component, inject } from '@angular/core';
import { DrawingService } from '../../../canvas/services/drawing/drawing.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  drawingService: DrawingService = inject(DrawingService);

  draw() {
    this.drawingService.draw();
  }
}
