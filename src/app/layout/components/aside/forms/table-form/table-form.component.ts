import { NgFor } from '@angular/common';
import { Attribute, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { McdTableService } from '../../../../../domain/mcd/services/table/mcd-table.service';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { McdTableAttribute } from '../../../../../domain/mcd/models/mcd-table-attribute.type';
import { FocusDirective } from '../../../../directives/focus.directive';
import { TableExistsValidator } from '../validators/table-exists/table-exists.validator';

@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, FocusDirective],
  templateUrl: './table-form.component.html',
  styleUrl: '../aside-form.component.css'
})
export class TableFormComponent {
  tableService: McdTableService = inject(McdTableService);
  tableValidator: TableExistsValidator = inject(TableExistsValidator);

  formBuilder = inject(FormBuilder);
  tableForm = this.formBuilder.group({
    tableName: ['', [Validators.required], [this.tableValidator.validate.bind(this.tableValidator)], 'blur'],
    tableAttributes: this.formBuilder.array([])
  });

  get attributes() {
    return this.tableForm.get('tableAttributes') as FormArray;
  }

  addTableAttributes(): void {
    const attributesGroup = this.formBuilder.group({
      attributeName: ['', [Validators.required, this.attributeExistsValidator()]]
    });
    this.attributes.push(attributesGroup);
  }

  removeTableAttribute(index: number): void {
    this.attributes.removeAt(index);
  }

  onSubmit(): void {
    const table: McdTable = new McdTable(
      this.tableForm.value.tableName as string,
      (this.tableForm.value.tableAttributes as McdTableAttribute[])
        .map((attribute: Attribute) => attribute.attributeName));
    this.tableService.addTable(table);
  }

  attributeExistsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      for (let aControl of this.attributes.controls) {
        if (aControl.value.attributeName == control.value) {
          return { attributeExists: `L'attribut ${control.value} existe déjà` };
        }
      }
      return null;
    }
  }
}
