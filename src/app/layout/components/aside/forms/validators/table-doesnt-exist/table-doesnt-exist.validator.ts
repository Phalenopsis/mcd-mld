import { inject, Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { McdTableService } from "../../../../../../domain/mcd/services/table/mcd-table.service";
import { catchError, first, map, Observable, of, switchMap, take } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TableDoesntExistValidator implements AsyncValidator {
    tableService: McdTableService = inject(McdTableService);

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return control.events.pipe(
            take(1),
            switchMap(() => this.tableService.$exists(control.value).pipe(
                map((exists) => (exists ? null : { tableDoesntExist: `La table ${control.value} n'existe pas.` })),
                catchError((error: Error) => of({ tableDoesntExist: error.message })),
                first()
            ))
        );
    }
}