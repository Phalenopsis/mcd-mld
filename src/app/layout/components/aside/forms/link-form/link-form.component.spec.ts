import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkFormComponent } from './link-form.component';
import { McdTableService } from '../../../../../domain/mcd/services/table/mcd-table.service';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TableDoesntExistValidator } from '../validators/table-doesnt-exist/table-doesnt-exist.validator';
import { FormControl } from '@angular/forms';
import { DebugElement } from '@angular/core';

describe('LinkFormComponent, with async TableValidator ok', () => {
  let component: LinkFormComponent;
  let fixture: ComponentFixture<LinkFormComponent>;
  let table1Select: HTMLSelectElement;
  const tables = [new McdTable('user', []), new McdTable('car', [])];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkFormComponent],
      providers: [McdTableService, TableDoesntExistValidator]
    })
      .compileComponents();

    const tableService = TestBed.inject(McdTableService);
    spyOn(tableService, '$getTableList').and.returnValue(of(tables));

    const tableValidator = TestBed.inject(TableDoesntExistValidator);
    spyOn(tableValidator, 'validate').and.returnValue(of(null));

    fixture = TestBed.createComponent(LinkFormComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    table1Select = fixture.nativeElement.querySelector('select');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test selects', () => {
    let table1Control: FormControl<string>;

    beforeEach(() => {
      expect(table1Select).toBeTruthy();
      table1Control = component.linkForm.controls.tables.controls.table1;
      table1Select.value = table1Select.options[1].value;
      table1Select.dispatchEvent(new Event('change'));
    });

    it('should have user in select 1', () => {
      expect(table1Control.value).toEqual('user');
    });

    it('should table1 be valid', () => {
      expect(table1Control.valid).toBeTruthy();
    });

    describe('test select 2', () => {
      let table2Control: FormControl<string>;
      let table2Select: HTMLSelectElement;

      beforeEach(() => {
        table2Control = component.linkForm.controls.tables.controls.table2;
        table2Select = fixture.debugElement.query(By.css('#table2')).nativeElement;
        table2Select.value = table2Select.options[1].value;
        table2Select.dispatchEvent(new Event('change'));
      });

      it('should be user', () => {
        expect(table2Control.value).toEqual('user');
        expect(table2Control.valid).toBeTruthy();
      });

      it('should be in error because 2 table names match', () => {
        expect(component.linkForm.controls.tables.valid).toBeFalsy();
        expect(component.linkForm.controls.tables.hasError('namesMatch')).toBeTruthy();
      });

      it('should be ok if a table name changes', () => {
        table2Select.value = table2Select.options[2].value;
        table2Select.dispatchEvent(new Event('change'));
        expect(table2Control.value).toEqual('car');
        expect(table2Control.valid).toBeTruthy();

        expect(component.linkForm.controls.tables.valid).toBeTruthy();
      })
    });
  });

  describe('test action input before tables', () => {
    let actionDebugElement: DebugElement;
    beforeEach(() => {
      actionDebugElement = fixture.debugElement.query(By.css('#action'));
    });

    it('should not exists', () => {
      expect(actionDebugElement).toBeFalsy();
    });
  });

  describe('test action input after tables', () => {
    let actionDebugElement: DebugElement;
    let table2Select: HTMLSelectElement;
    let actionElement: HTMLInputElement;

    beforeEach(() => {
      table1Select.value = table1Select.options[1].value;
      table1Select.dispatchEvent(new Event('change'));
      table2Select = fixture.debugElement.query(By.css('#table2')).nativeElement;
      table2Select.value = table2Select.options[2].value;
      table2Select.dispatchEvent(new Event('change'));

      actionDebugElement = fixture.debugElement.query(By.css('#action'));
      actionElement = actionDebugElement.nativeElement;
    });

    it('should exists', () => {
      expect(actionDebugElement).toBeTruthy();
    });

    it('should be false if there\'s no value', () => {
      expect(component.linkForm.controls.action.valid).toBeFalsy();
    });

    it('should exists if action is filled', () => {
      actionElement.value = 'drive';
      actionElement.dispatchEvent(new Event('input'));
      expect(component.linkForm.controls.action.valid).toBeTruthy();
    });

    describe('test radio Element', () => {
      let radiosDebug: DebugElement[];

      beforeEach(() => {
        actionElement.value = 'drive';
        actionElement.dispatchEvent(new Event('input'));
        radiosDebug = fixture.debugElement.queryAll(By.css('input[type=radio]'));
      });

      it('should show 4 choices', () => {
        expect(radiosDebug.length).toEqual(4);
      });

      describe('fill all elements', () => {
        let secondOption: HTMLInputElement;
        let relationTypeResultElement: HTMLElement;
        let buttonDebug: HTMLButtonElement;

        beforeEach(() => {
          secondOption = radiosDebug[1].nativeElement;
          secondOption.checked = true;
          secondOption.dispatchEvent(new Event('change'));
          relationTypeResultElement = fixture.debugElement.query(By.css('#relationTypeResult')).nativeElement;
          buttonDebug = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
        });

        it('should display a sentence if all elements are filled', () => {
          expect(relationTypeResultElement.textContent).toContain(tables[0].name);
          expect(relationTypeResultElement.textContent).toContain(tables[1].name);
          expect(relationTypeResultElement.textContent).toContain('drive');
        });

        it('should be able to submit', () => {
          buttonDebug = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
          expect(buttonDebug.disabled).toBeFalsy();
        })
      });
    });
  });

  describe('test radio Element', () => {
    it('should not exists', () => {
      let radiosDebug = fixture.debugElement.queryAll(By.css('input[type=radio]'));
      expect(radiosDebug.length).toEqual(0);
    })
  });

  it('should not be possible to submit if all elements are not filled', async () => {
    let buttonDebug: HTMLButtonElement = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    expect(buttonDebug.disabled).toBeTruthy();
  })
});

describe('LinkFormComponent, with async TableValidator ko', () => {
  let component: LinkFormComponent;
  let fixture: ComponentFixture<LinkFormComponent>;
  let table1Select: HTMLSelectElement;
  let table2Select: HTMLSelectElement;
  const tables = [new McdTable('user', []), new McdTable('car', [])];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkFormComponent],
      providers: [McdTableService, TableDoesntExistValidator]
    })
      .compileComponents();

    const tableService = TestBed.inject(McdTableService);
    spyOn(tableService, '$getTableList').and.returnValue(of(tables));

    const tableValidator = TestBed.inject(TableDoesntExistValidator);
    spyOn(tableValidator, 'validate').and.returnValue(of({ tableDoesntExist: `La table test n'existe pas.` }));

    fixture = TestBed.createComponent(LinkFormComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    table1Select = fixture.nativeElement.querySelector('select');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('verify select Table 1', () => {
    let table1Control: FormControl<string>;
    beforeEach(() => {
      table1Control = component.linkForm.controls.tables.controls.table1;
      table1Select.options[2].value = 'test';
      table1Select.value = table1Select.options[2].value;
      table1Select.dispatchEvent(new Event('change'));
    });

    it('should have test in select 1', () => {
      expect(table1Control.value).toEqual('test');
    });

    it('should be error for select table 1', () => {
      expect(table1Control.valid).toBeFalsy();
      expect(table1Control.errors?.['tableDoesntExist']).toBeTruthy();
      expect(table1Control.errors?.['tableDoesntExist']).toEqual("La table test n'existe pas.");
    })
  });

  describe('verify select Table 2', () => {
    let table2Control: FormControl<string>;
    beforeEach(() => {
      table2Select = fixture.debugElement.query(By.css('#table2')).nativeElement;
      table2Control = component.linkForm.controls.tables.controls.table2;
      table2Select.options[2].value = 'test';
      table2Select.value = table2Select.options[2].value;
      table2Select.dispatchEvent(new Event('change'));
    });

    it('should have test in select 2', () => {
      expect(table2Control.value).toEqual('test');
    });

    it('should be error for select table 2', () => {
      expect(table2Control.valid).toBeFalsy();
      expect(table2Control.errors?.['tableDoesntExist']).toBeTruthy();
      expect(table2Control.errors?.['tableDoesntExist']).toEqual("La table test n'existe pas.");
    })
  });


});
