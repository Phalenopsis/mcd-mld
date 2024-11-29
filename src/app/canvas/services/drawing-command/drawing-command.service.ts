import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawingCommandService {
  $drawOrder: Subject<string> = new Subject<string>();

  constructor() { }

  getDrawOrder(): Observable<string> {
    return this.$drawOrder.asObservable();
  }

  draw() {
    this.$drawOrder.next("draw");
  }

  clear() {
    this.$drawOrder.next("clear");
  }
}
