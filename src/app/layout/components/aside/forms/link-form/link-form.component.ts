import { Component, inject, OnInit } from '@angular/core';
import { TableService } from '../../../../../domain/mcd/services/table/table.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, take } from 'rxjs';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-link-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './link-form.component.html',
  styleUrl: '../aside-form.component.css'
})
export class LinkFormComponent implements OnInit {
  tableService: TableService = inject(TableService);

  formBuilder = inject(FormBuilder);

  declare $tables: Observable<string[]>;

  relationTypeList = ["OneToOne", "OneToMany", "ManyToOne", "ManyToMany"];

  linkForm = this.formBuilder.group({
    tables: this.formBuilder.group({
      table1: ['', [Validators.required, this.tableIsKnownValidator()]],
      table2: ['', [Validators.required, this.tableIsKnownValidator()]],
    }, { validators: this.tablesAreDifferentsValidator() }),

    action: ['', [Validators.required]],
    relationType: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.$tables = this.tableService.$getTableList().pipe(
      map((tables: McdTable[]) => tables.map((table: McdTable) => table.name))
    )
  }

  onSubmit() {
    if (this.linkForm.valid) {
      console.log('formulaire ok', this.linkForm.value);
    } else {
      console.log('Formulaire KO');
    }
  }

  tableIsKnownValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.$tables) return { tableIsKnown: true };
      console.log('table')
      let tablesName: string[] = [];
      this.$tables.pipe(take(1)).subscribe(
        tables => tablesName = tables
      )
      return tablesName.includes(control.value) ? null : { tableIsKnown: true };
    }
  }

  tablesAreDifferentsValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const table1 = formGroup.get('table1')?.value;
      const table2 = formGroup.get('table2')?.value;
      return table1 !== table2 ? null : { namesMatch: true };
    }
  }
}
