import { Component } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-flow-page',
  standalone: true,
  imports: [CanvasComponent, EditorComponent],
  templateUrl: './flow-page.component.html',
  styleUrl: './flow-page.component.css'
})
export class FlowPageComponent {

}
