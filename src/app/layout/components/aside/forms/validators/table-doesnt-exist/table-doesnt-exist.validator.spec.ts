import { TestBed } from '@angular/core/testing';
import { McdTableService } from '../../../../../../domain/mcd/services/table/mcd-table.service';
import { of, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { TableDoesntExistValidator } from './table-doesnt-exist.validator';

describe('TableAlreadyExistsValidator - Table does not exist', () => {
    let tableValidator: TableDoesntExistValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableDoesntExistValidator);
        const tableService = TestBed.inject(McdTableService);
        spyOn(tableService, '$exists').and.returnValue(of(false));
    });

    it('should be created', () => {
        expect(tableValidator).toBeTruthy();
    });

    it('should return error', (done: DoneFn) => {
        let formControl = new FormControl('blabla');
        let result: any;
        tableValidator.validate(formControl).pipe().subscribe(
            exists => {
                result = exists;
                expect(result).toBeTruthy();
                expect(result['tableDoesntExist']).toEqual(`La table blabla n'existe pas.`)
                done();
            }
        )
        formControl.markAsTouched();
    })
});

describe('TableAlreadyExistsValidator - Table exist', () => {
    let tableValidator: TableDoesntExistValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableDoesntExistValidator);
        const tableService = TestBed.inject(McdTableService);
        spyOn(tableService, '$exists').and.returnValue(of(true));
    });

    it('should return error', (done: DoneFn) => {
        let formControl = new FormControl('user');
        tableValidator.validate(formControl).pipe().subscribe(
            exists => {
                expect(exists).toBeFalsy();
                expect(exists).toBeNull();
                done();
            }
        )
        formControl.markAsTouched();
    })
});

describe('TableAlreadyExistsValidator - has error', () => {
    let tableValidator: TableDoesntExistValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableDoesntExistValidator);
        const tableService = TestBed.inject(McdTableService);
        spyOn(tableService, '$exists').and.returnValue(throwError(() => new Error('something is wrong')));
    });

    it('should return error if validator is in error', (done: DoneFn) => {
        let formControl = new FormControl('user');
        tableValidator.validate(formControl).pipe().subscribe(
            exists => {
                expect(exists).toBeTruthy();
                if (exists) expect(exists['tableDoesntExist']).toEqual('something is wrong');
                done();
            }
        )
        formControl.markAsTouched();
    })
});