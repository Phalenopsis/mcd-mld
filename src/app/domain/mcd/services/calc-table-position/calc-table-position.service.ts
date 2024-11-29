import { Injectable } from '@angular/core';
import { Rectangle } from '@plan/models/classes/rectangle.class';
import { McdTable } from '../../models/mcd-table.class';

@Injectable({
  providedIn: 'root'
})
export class CalcTablePositionService {
  constructor() { }

  calcPositions(plan: Rectangle, tables: McdTable[]) {

  }

}
