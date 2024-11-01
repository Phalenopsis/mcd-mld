import { Injectable } from '@angular/core';
import { McdTable } from '../../models/mcd-table.class';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class McdTableService {
  tables = [
    new McdTable("Auteur", ["id", "nom", "prénom"]),
    new McdTable("Livre", ["id", "titre", "éditeur", "nombre de pages"]),
    new McdTable("Voiture", ["model", "marque"]),
    new McdTable("Couleur", ["nom"]),
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
}
