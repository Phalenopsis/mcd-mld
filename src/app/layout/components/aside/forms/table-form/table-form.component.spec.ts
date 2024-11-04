import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFormComponent } from './table-form.component';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { McdTableService } from '../../../../../domain/mcd/services/table/mcd-table.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('TableFormComponent', () => {
  let component: TableFormComponent;
  let fixture: ComponentFixture<TableFormComponent>;
  let getTablesSpy: jasmine.Spy;
  let table1Select: HTMLSelectElement;
  const tables = [new McdTable('user', []), new McdTable('car', [])];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFormComponent],
      providers: [McdTableService]
    })
      .compileComponents();

    const tableService = TestBed.inject(McdTableService);
    spyOn(tableService, '$getTableList').and.returnValue(of(tables));

    fixture = TestBed.createComponent(TableFormComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tableName input', () => {
    const tableNameInput: HTMLInputElement = fixture.debugElement.query(By.css('#tableName')).nativeElement;
    expect(tableNameInput).toBeTruthy();
    expect(component.tableForm.controls.tableName.valid).toBeFalsy();
  });

  it('should be possible to submit form when tableName is not blank', () => {
    let buttonDebug = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    expect(buttonDebug.disabled).toBeTruthy();

    const tableNameInput: HTMLInputElement = fixture.debugElement.query(By.css('#tableName')).nativeElement;
    tableNameInput.value = 'startingPoint';
    tableNameInput.dispatchEvent(new Event('input'));
    expect(component.tableForm.controls.tableName.valid).toBeTruthy();
    expect(component.tableForm.valid).toBeTruthy();

    buttonDebug = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;

    expect(component.tableForm.invalid).toBeFalsy();
    expect(buttonDebug.disabled).toBeFalsy();
  });

  it('should grow when click on button', () => {
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#addAttribute')).nativeElement;
    const fieldset: HTMLFieldSetElement = fixture.debugElement.query(By.css('#tableAttributes')).nativeElement;

    expect(fieldset.childNodes.length).toEqual(3);
    button.click();
    expect(fieldset.childNodes.length).toEqual(4);
    button.click();
    expect(fieldset.childNodes.length).toEqual(5);
    button.click();
    button.click();
    expect(fieldset.childNodes.length).toEqual(7);
  });

  it('should narrow when click on button to delete field', () => {
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#addAttribute')).nativeElement;
    const fieldset: HTMLFieldSetElement = fixture.debugElement.query(By.css('#tableAttributes')).nativeElement;

    button.click();
    button.click();
    button.click();
    button.click();
    expect(fieldset.childNodes.length).toEqual(7);
    const deleteFieldButtons: DebugElement[] = fixture.debugElement.queryAll(By.css('.deleteFieldButton'));

    deleteFieldButtons[deleteFieldButtons.length - 1].nativeElement.click();
    expect(fieldset.childNodes.length).toEqual(6);
  });

  it('should take focus when attritute field appear', () => {
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#addAttribute')).nativeElement;
    const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    const fieldset: HTMLFieldSetElement = fixture.debugElement.query(By.css('#tableAttributes')).nativeElement;

    const tableNameInput: HTMLInputElement = fixture.debugElement.query(By.css('#tableName')).nativeElement;
    tableNameInput.value = 'startingPoint';
    tableNameInput.dispatchEvent(new Event('input'));
    expect(component.tableForm.controls.tableName.valid).toBeTruthy();
    expect(component.tableForm.valid).toBeTruthy();

    button.click();
    expect(fieldset.childNodes.length).toEqual(4);
    const deleteFieldButtons: DebugElement[] = fixture.debugElement.queryAll(By.css('.deleteFieldButton'));

    const attributeInput1: HTMLInputElement = fixture.debugElement.query(By.css('#attribute-0')).nativeElement;
    let focusElement = fixture.debugElement.query(By.css(":focus")).nativeElement;
    expect(focusElement).toBe(attributeInput1);
    attributeInput1.value = 'name';
    attributeInput1.dispatchEvent(new Event('input'));
    expect(component.tableForm.controls.tableAttributes.controls[0].valid).toBeTruthy();
    expect(component.tableForm.valid).toBeTruthy();
    expect(submitButton.disabled).toBeFalsy();

    button.click();
    const attributeInput2: HTMLInputElement = fixture.debugElement.query(By.css('#attribute-1')).nativeElement;
    focusElement = fixture.debugElement.query(By.css(":focus")).nativeElement;
    expect(focusElement).toBe(attributeInput2);
    expect(submitButton.disabled).toBeTruthy();

    attributeInput2.value = 'emai';
    attributeInput2.dispatchEvent(new Event('input'));
    expect(submitButton.disabled).toBeFalsy();

    // deleteFieldButtons[deleteFieldButtons.length - 1].nativeElement.click();
    // expect(fieldset.childNodes.length).toEqual(6);

  })
});

