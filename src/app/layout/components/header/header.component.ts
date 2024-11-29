import { Component, inject } from '@angular/core';
import { DrawingCommandService } from '../../../canvas/services/drawing-command/drawing-command.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  drawingService: DrawingCommandService = inject(DrawingCommandService);

  draw() {
    this.drawingService.draw();
  }

  clear() {
    this.drawingService.clear();
  }
}
