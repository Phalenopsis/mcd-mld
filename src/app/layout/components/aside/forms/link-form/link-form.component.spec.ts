import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkFormComponent } from './link-form.component';
import { McdTableService } from '../../../../../domain/mcd/services/table/mcd-table.service';
import { McdTable } from '../../../../../domain/mcd/models/mcd-table.class';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LinkFormComponent', () => {
  let component: LinkFormComponent;
  let fixture: ComponentFixture<LinkFormComponent>;
  let getTablesSpy: jasmine.Spy;
  let table1Select: HTMLSelectElement;
  const tables = [new McdTable('user', []), new McdTable('car', [])];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkFormComponent],
      providers: [McdTableService]
    })
      .compileComponents();


    const tableService = TestBed.inject(McdTableService);
    spyOn(tableService, '$getTableList').and.returnValue(of(tables));

    fixture = TestBed.createComponent(LinkFormComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    table1Select = fixture.nativeElement.querySelector('select');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user in select', async () => {
    await fixture.whenStable();
    expect(table1Select).toBeTruthy();
    const table1Control = component.linkForm.controls.tables.controls.table1;
    table1Select.value = table1Select.options[1].value;
    table1Select.dispatchEvent(new Event('change'));
    expect(table1Control.value).toEqual('user');
    expect(table1Control.valid).toBeTruthy();

    const table2Control = component.linkForm.controls.tables.controls.table2;
    const table2Select: HTMLSelectElement = fixture.debugElement.query(By.css('#table2')).nativeElement;
    table2Select.value = table2Select.options[1].value;
    table2Select.dispatchEvent(new Event('change'));
    expect(table2Control.value).toEqual('user');
    expect(table2Control.valid).toBeTruthy();

    expect(component.linkForm.controls.tables.valid).toBeFalsy();
    expect(component.linkForm.controls.tables.hasError('namesMatch')).toBeTruthy();

    table2Select.value = table2Select.options[2].value;
    table2Select.dispatchEvent(new Event('change'));
    expect(table2Control.value).toEqual('car');
    expect(table2Control.valid).toBeTruthy();

    expect(component.linkForm.controls.tables.valid).toBeTruthy();
  });

  it('should test action input', async () => {
    let actionDebugElement = fixture.debugElement.query(By.css('#action'));
    expect(actionDebugElement).toBeFalsy();

    await fixture.whenStable();
    table1Select.value = table1Select.options[1].value;
    table1Select.dispatchEvent(new Event('change'));
    const table2Select: HTMLSelectElement = fixture.debugElement.query(By.css('#table2')).nativeElement;
    table2Select.value = table2Select.options[2].value;
    table2Select.dispatchEvent(new Event('change'));

    actionDebugElement = fixture.debugElement.query(By.css('#action'));
    expect(actionDebugElement).toBeTruthy();
    const actionElement: HTMLInputElement = actionDebugElement.nativeElement;
    expect(component.linkForm.controls.action.valid).toBeFalsy();
    actionElement.value = 'drive';
    actionElement.dispatchEvent(new Event('input'));
    expect(component.linkForm.controls.action.valid).toBeTruthy();
  })

  it('should test RelationType radio button', async () => {
    let radiosDebug = fixture.debugElement.queryAll(By.css('input[type=radio]'));
    expect(radiosDebug.length).toEqual(0);

    table1Select.value = table1Select.options[1].value;
    table1Select.dispatchEvent(new Event('change'));
    const table2Select: HTMLSelectElement = fixture.debugElement.query(By.css('#table2')).nativeElement;
    table2Select.value = table2Select.options[2].value;
    table2Select.dispatchEvent(new Event('change'));
    const actionDebugElement = fixture.debugElement.query(By.css('#action'));
    const actionElement: HTMLInputElement = actionDebugElement.nativeElement;
    actionElement.value = 'drive';
    actionElement.dispatchEvent(new Event('input'));

    radiosDebug = fixture.debugElement.queryAll(By.css('input[type=radio]'));
    expect(radiosDebug.length).toEqual(4);

    let secondOption: HTMLInputElement = radiosDebug[1].nativeElement;
    secondOption.checked = true;
    secondOption.dispatchEvent(new Event('change'));


    let relationTypeResultElement: HTMLElement = fixture.debugElement.query(By.css('#relationTypeResult')).nativeElement;
    expect(relationTypeResultElement.textContent).toContain(tables[0].name);
    expect(relationTypeResultElement.textContent).toContain(tables[1].name);
    expect(relationTypeResultElement.textContent).toContain('drive');
  })
});
