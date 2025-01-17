import { Injectable } from '@angular/core';
import { McdTable } from '../../models/mcd-table.class';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class McdTableService {
  tables = [
    new McdTable("User", ["id", "email", "password"]),
    new McdTable("Project", ["id", "name", "user_id", "projecttype_id"]),
    new McdTable("ProjectType", ["id", "name"]),
    new McdTable("Bdd", ["id", "nom", "user_id"]),
    new McdTable("Flow", ["id", "nom", "user_id"]),
    new McdTable("Passager", ["nom", "prenom"])
  ];
  $tableList: BehaviorSubject<McdTable[]> = new BehaviorSubject(this.tables);

  constructor() { }

  addTable(table: McdTable) {
    this.tables.push(table);
    this.$tableList.next(this.tables);
  }

  $getTableList(): Observable<McdTable[]> {
    return this.$tableList.asObservable();
  }

  $getTableByName(name: string): Observable<McdTable> {
    return this.$tableList.pipe(
      map((tables: McdTable[]) => tables.filter(table => table.name === name).shift() as McdTable)
    );
  }

  $exists(name: string): Observable<boolean> {
    return this.$tableList.pipe(
      map((tables: McdTable[]) => tables.some((table) => table.name === name))
    )
  }
}
