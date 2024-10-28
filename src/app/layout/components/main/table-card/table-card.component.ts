import { Component, Input } from '@angular/core';
import { McdTable } from '../../../../domain/mcd/models/mcd-table.class';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [],
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.css'
})
export class TableCardComponent {
  @Input() declare table: McdTable;
}
