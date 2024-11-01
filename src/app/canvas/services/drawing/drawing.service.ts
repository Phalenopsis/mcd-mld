import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  $drawOrder: Subject<string> = new Subject<string>();

  constructor() { }

  draw() {
    this.$drawOrder.next("go");
  }

  getDrawOrder(): Observable<string> {
    return this.$drawOrder.asObservable();
  }
}
