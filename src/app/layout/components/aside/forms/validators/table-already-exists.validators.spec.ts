import { TestBed } from '@angular/core/testing';
import { TableAlreadyExistsValidator } from './table-already-exists.validator';
import { McdTableService } from '../../../../../domain/mcd/services/table/mcd-table.service';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('TableAlreadyExistsValidator - no error', () => {
    let tableValidator: TableAlreadyExistsValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableAlreadyExistsValidator);
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
                console.log(result);
                done();
            }
        )
        formControl.markAsTouched();
    })
});

describe('TableAlreadyExistsValidator - has error', () => {
    let tableValidator: TableAlreadyExistsValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [McdTableService]
        });
        tableValidator = TestBed.inject(TableAlreadyExistsValidator);
        const tableService = TestBed.inject(McdTableService);
        spyOn(tableService, '$exists').and.returnValue(of(true));
    });

    it('should return error', (done: DoneFn) => {
        let formControl = new FormControl('user');
        tableValidator.validate(formControl).pipe().subscribe(
            exists => {
                expect(exists).toBeTruthy();
                console.log(exists);
                if (exists) expect(exists['tableExists']).toBeTrue();
                done();
            }
        )
        formControl.markAsTouched();
    })
});