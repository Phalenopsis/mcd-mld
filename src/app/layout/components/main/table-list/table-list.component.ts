import { Component, inject, OnInit } from '@angular/core';
import { McdTableService } from '../../../../domain/mcd/services/table/mcd-table.service';
import { McdTable } from '../../../../domain/mcd/models/mcd-table.class';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TableCardComponent } from '../table-card/table-card.component';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [AsyncPipe, TableCardComponent],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css', '../main.css']
})
export class TableListComponent implements OnInit {
  service: McdTableService = inject(McdTableService);
  declare $tables: Observable<McdTable[]>;

  ngOnInit(): void {
    this.$tables = this.service.$getTableList();
  }
}
