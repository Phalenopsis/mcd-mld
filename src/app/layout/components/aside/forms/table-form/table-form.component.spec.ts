import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFormComponent } from './table-form.component';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { McdTableService } from '../../../../../domain/mcd/services/table/mcd-table.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TableAlreadyExistsValidator } from '../validators/table-already-exists.validator';

describe('TableFormComponent - with async TableValidator ok', () => {
  let component: TableFormComponent;
  let fixture: ComponentFixture<TableFormComponent>;
  const tables = [new McdTable('user', []), new McdTable('car', [])];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFormComponent],
      providers: [McdTableService, TableAlreadyExistsValidator]
    })
      .compileComponents();

    const tableService = TestBed.inject(McdTableService);
    spyOn(tableService, '$getTableList').and.returnValue(of(tables));

    const tableValidator = TestBed.inject(TableAlreadyExistsValidator);
    spyOn(tableValidator, 'validate').and.returnValue(of(null));

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

  describe('test FormArray', () => {
    let addAttributeButton: HTMLButtonElement;
    let fieldset: HTMLFieldSetElement;

    beforeEach(() => {
      addAttributeButton = fixture.debugElement.query(By.css('#addAttribute')).nativeElement;
      fieldset = fixture.debugElement.query(By.css('#tableAttributes')).nativeElement;
    });

    it('should grow when click on button', () => {
      expect(fieldset.childNodes.length).toEqual(3);
      addAttributeButton.click();
      expect(fieldset.childNodes.length).toEqual(4);
      addAttributeButton.click();
      expect(fieldset.childNodes.length).toEqual(5);
      addAttributeButton.click();
      addAttributeButton.click();
      expect(fieldset.childNodes.length).toEqual(7);
    });

    it('should narrow when click on button to delete field', () => {
      addAttributeButton.click();
      addAttributeButton.click();
      addAttributeButton.click();
      addAttributeButton.click();
      expect(fieldset.childNodes.length).toEqual(7);
      const deleteFieldButtons: DebugElement[] = fixture.debugElement.queryAll(By.css('.deleteFieldButton'));

      deleteFieldButtons[deleteFieldButtons.length - 1].nativeElement.click();
      expect(fieldset.childNodes.length).toEqual(6);
    });

    describe('fully completed form', () => {
      let submitButton: HTMLButtonElement;
      let tableNameInput: HTMLInputElement;
      let attributeInput1: HTMLInputElement;
      let attributeInput2: HTMLInputElement;
      let focusElement: HTMLInputElement;

      beforeEach(async () => {
        await fixture.whenStable();
        submitButton = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
        tableNameInput = fixture.debugElement.query(By.css('#tableName')).nativeElement;
        tableNameInput.value = 'startingPoint';
        tableNameInput.dispatchEvent(new Event('input'));
        addAttributeButton.click();
        attributeInput1 = fixture.debugElement.query(By.css('#attribute-0')).nativeElement;

      });

      it('should take focus when attribute field appear', async () => {
        if (fixture.debugElement.query(By.css(":focus"))) {
          focusElement = fixture.debugElement.query(By.css(":focus")).nativeElement;
          expect(focusElement).toBe(attributeInput1);
        }

      });

      it('should change focus when another attribute field appear', () => {
        addAttributeButton.click();
        attributeInput2 = fixture.debugElement.query(By.css('#attribute-1')).nativeElement;
        if (fixture.debugElement.query(By.css(":focus"))) {
          focusElement = fixture.debugElement.query(By.css(":focus")).nativeElement;
          expect(focusElement).toBe(attributeInput2);
        }

      });

      describe('can I submit ?', () => {
        beforeEach(() => {
          attributeInput1.value = 'name';
          attributeInput1.dispatchEvent(new Event('input'));
        });

        it('should be able to submit', () => {
          expect(component.tableForm.controls.tableAttributes.controls[0].valid).toBeTruthy();
          expect(component.tableForm.valid).toBeTruthy();
          expect(submitButton.disabled).toBeFalsy();
        });

        describe('if i want a second attribute', () => {
          beforeEach(() => {
            addAttributeButton.click();
            attributeInput2 = fixture.debugElement.query(By.css('#attribute-1')).nativeElement;
          });

          it('should not be able to submit if second attribute is blank', () => {
            expect(submitButton.disabled).toBeTruthy();
          });

          describe('if the second attribute is filled', () => {
            beforeEach(() => {
              spyOn(McdTableService.prototype, 'addTable').and.callThrough();

              attributeInput2.value = 'email';
              attributeInput2.dispatchEvent(new Event('input'));

            });

            it('should be able to submit if second attribute is filled', () => {
              expect(submitButton.disabled).toBeFalsy();
            });

            it('should call TableService if form is submitted', () => {
              submitButton.click();
              expect(McdTableService.prototype.addTable).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});

describe('TableFormComponent - with async TableValidator ok', () => {
  let component: TableFormComponent;
  let fixture: ComponentFixture<TableFormComponent>;
  const tables = [new McdTable('user', []), new McdTable('car', [])];
  let tableNameInput: HTMLInputElement;
  let attributeInput1: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFormComponent],
      providers: [McdTableService, TableAlreadyExistsValidator]
    })
      .compileComponents();

    const tableService = TestBed.inject(McdTableService);
    spyOn(tableService, '$getTableList').and.returnValue(of(tables));

    const tableValidator = TestBed.inject(TableAlreadyExistsValidator);
    spyOn(tableValidator, 'validate').and.returnValue(of({ tableExists: true }));

    fixture = TestBed.createComponent(TableFormComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();

    let addAttributeButton: HTMLButtonElement;
    let fieldset: HTMLFieldSetElement;
    addAttributeButton = fixture.debugElement.query(By.css('#addAttribute')).nativeElement;
    fieldset = fixture.debugElement.query(By.css('#tableAttributes')).nativeElement;
    tableNameInput = fixture.debugElement.query(By.css('#tableName')).nativeElement;
    tableNameInput.value = 'startingPoint';
    tableNameInput.dispatchEvent(new Event('input'));
    addAttributeButton.click();
    attributeInput1 = fixture.debugElement.query(By.css('#attribute-0')).nativeElement;
  });

  it('should not be possible to submit if table already exists', async () => {
    await fixture.whenStable();
    tableNameInput.value = 'car';
    attributeInput1.dispatchEvent(new Event('input'));

    await fixture.whenStable();

    expect(component.tableForm.controls.tableName.invalid).toBeTruthy()
  })
});

