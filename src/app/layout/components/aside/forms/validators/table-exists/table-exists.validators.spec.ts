import { TestBed } from '@angular/core/testing';
import { TableExistsValidator } from './table-exists.validator';
import { McdTableService } from '../../../../../../domain/mcd/services/table/mcd-table.service';
import { of, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('TableAlreadyExistsValidator - no error', () => {
    let tableValidator: TableExistsValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableExistsValidator);
        const tableService = TestBed.inject(McdTableService);
        spyOn(tableService, '$exists').and.returnValue(of(false));
    });

    it('should be created', () => {
        expect(tableValidator).toBeTruthy();
    });

    it('should not return error', (done: DoneFn) => {
        let formControl = new FormControl('blabla');
        let result: any;
        tableValidator.validate(formControl).pipe().subscribe(
            exists => {
                result = exists;
                expect(result).toBeFalsy();
                done();
            }
        )
        formControl.markAsTouched();
    })
});

describe('TableAlreadyExistsValidator - has error', () => {
    let tableValidator: TableExistsValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableExistsValidator);
        const tableService = TestBed.inject(McdTableService);
        spyOn(tableService, '$exists').and.returnValue(of(true));
    });

    it('should return error', (done: DoneFn) => {
        let formControl = new FormControl('user');
        tableValidator.validate(formControl).pipe().subscribe(
            exists => {
                expect(exists).toBeTruthy();
                if (exists) expect(exists['tableExists']).toEqual('La table user existe déjà.');
                done();
            }
        )
        formControl.markAsTouched();
    })
});

describe('TableAlreadyExistsValidator - has error', () => {
    let tableValidator: TableExistsValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableExistsValidator);
        const tableService = TestBed.inject(McdTableService);
        spyOn(tableService, '$exists').and.returnValue(throwError(() => new Error('something is wrong')));
    });

    it('should return error if validator is in error', (done: DoneFn) => {
        let formControl = new FormControl('user');
        tableValidator.validate(formControl).pipe().subscribe(
            exists => {
                expect(exists).toBeTruthy();
                if (exists) expect(exists['tableExists']).toEqual('something is wrong');
                done();
            }
        )
        formControl.markAsTouched();
    })
});