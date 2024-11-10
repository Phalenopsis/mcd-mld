import { Component, inject, OnInit } from '@angular/core';
import { McdTableService } from '../../../../../domain/mcd/services/table/mcd-table.service';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, take, tap } from 'rxjs';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { AsyncPipe } from '@angular/common';
import { RelationType } from '../../../../../domain/models/relation-type.enum';
import { McdLink } from '../../../../../domain/mcd/models/mcd-link.class';
import { TableDoesntExistValidator } from '../validators/table-doesnt-exist/table-doesnt-exist.validator';

@Component({
  selector: 'app-link-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './link-form.component.html',
  styleUrl: '../aside-form.component.css'
})
export class LinkFormComponent implements OnInit {
  tableService: McdTableService = inject(McdTableService);
  tableValidator: TableDoesntExistValidator = inject(TableDoesntExistValidator);

  formBuilder = inject(NonNullableFormBuilder);

  declare $tableNames: Observable<string[]>;
  declare $tables: Observable<McdTable[]>;

  relationTypeList = Object.values(RelationType);

  linkForm = this.formBuilder.group({
    tables: this.formBuilder.group({
      table1: ['', [Validators.required], [this.tableValidator.validate.bind(this.tableValidator)], 'blur'],
      table2: ['', [Validators.required], [this.tableValidator.validate.bind(this.tableValidator)], 'blur'],
    }, { validators: this.tablesAreDifferentsValidator() }),

    action: ['', [Validators.required]],
    relationType: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.$tableNames = this.tableService.$getTableList().pipe(
      map((tables: McdTable[]) => tables.map((table: McdTable) => table.name))
    );
    this.$tables = this.tableService.$getTableList();
  }

  onSubmit() {
    if (this.linkForm.valid) {
      const form = this.linkForm.getRawValue();
      let table1: McdTable;
      let table2: McdTable;
      this.$tables.pipe(
        tap((tables: McdTable[]) => {
          table1 = tables.filter(table => table.name === form.tables.table1).shift() as McdTable;
          table2 = tables.filter(table => table.name === form.tables.table2).shift() as McdTable;
        }),
        take(1)
      ).subscribe(
        () => {
          const link: McdLink = new McdLink(
            table1,
            table2,
            this.linkForm.value.action as string,
            this.linkForm.value.relationType as RelationType
          );
          // for verification
          console.log(link);
          // TODO
          // $link.next(link);
          this.linkForm.reset();
        }
      );

    } else {
      console.log('Formulaire KO');
    }
  }

  tablesAreDifferentsValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const table1 = formGroup.get('table1')?.value;
      const table2 = formGroup.get('table2')?.value;
      return table1 !== table2 ? null : { namesMatch: "Les tables doivent être différentes." };
    };
  }
}
