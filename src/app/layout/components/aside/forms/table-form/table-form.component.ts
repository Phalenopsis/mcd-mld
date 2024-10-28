import { NgFor } from '@angular/common';
import { Attribute, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableService } from '../../../../../domain/mcd/services/table/table.service';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { McdTableAttribute } from '../../../../../domain/mcd/models/mcd-table-attribute.type';
import { FocusDirective } from '../../../../directives/focus.directive';

@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, FocusDirective],
  templateUrl: './table-form.component.html',
  styleUrl: '../aside-form.component.css'
})
export class TableFormComponent {
  tableService: TableService = inject(TableService);

  formBuilder = inject(FormBuilder);
  tableForm = this.formBuilder.group({
    tableName: ['', [Validators.required]],
    tableAttributes: this.formBuilder.array([])
  });

  get attributes() {
    return this.tableForm.get('tableAttributes') as FormArray;
  }

  addTableAttributes(): void {
    const attributesGroup = this.formBuilder.group({
      attributeName: ['']
    });
    this.attributes.push(attributesGroup);
  }

  removeTableAttribute(index: number): void {
    this.attributes.removeAt(index);
  }

  onSubmit(): void {
    if (this.tableForm.valid) {
      console.log("ok")
      const table: McdTable = new McdTable(
        this.tableForm.value.tableName as string,
        (this.tableForm.value.tableAttributes as McdTableAttribute[])
          .map((attribute: Attribute) => attribute.attributeName));
      this.tableService.addTable(table);
    } else {
      console.log("Formulaire invalide");
    }
  }
}
