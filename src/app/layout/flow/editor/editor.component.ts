import { Component, inject } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { FlowCodeService } from '../services/flow-code.service';
import { DebounceKeyupDirective } from '../directives/debounce-keyup.directive';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, DebounceKeyupDirective],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  flowCodeService = inject(FlowCodeService);

  sendCode(code: string) {
    this.flowCodeService.receiveCode(code);
  }
}
