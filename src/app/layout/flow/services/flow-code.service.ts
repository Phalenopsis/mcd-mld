import { Injectable } from '@angular/core';
import { Step } from '../models/step.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { Action } from '../models/action.type';

@Injectable({
  providedIn: 'root'
})
export class FlowCodeService {
  codeToParse: string = "";
  steps: Step[] = [];
  actions: Action[] = [];

  steps$: BehaviorSubject<Step[]> = new BehaviorSubject<Step[]>([]);
  actions$: BehaviorSubject<Action[]> = new BehaviorSubject<Action[]>([]);

  getSteps$(): Observable<Step[]> {
    return this.steps$.asObservable();
  }

  getActions$(): Observable<Action[]> {
    return this.actions$.asObservable();
  }

  receiveCode(code: string) {
    this.codeToParse = code;
    this.parseCode();
  }

  parseCode() {
    this.steps = [];
    this.actions = [];
    const codeArray = this.codeToParse.split("\n").map((str: string) => str.trim());
    const codeFiltered = codeArray.filter((str: string) => str && !str.startsWith("#"));
    const declarations = codeFiltered.filter((str: string) => str.startsWith("declare"));
    const actions = codeFiltered.filter((str: string) => str.startsWith("action"));
    this.parseDeclarations(declarations);
    this.parseActions(actions);
  }

  parseDeclarations(declarations: string[]) {
    for (let declaration of declarations) {
      const arr = declaration.split(" ");
      //TODO vérifier que arr contient bien 3 strings
      this.doDeclare(arr);
    }
    this.steps$.next(this.steps);
  }

  doDeclare(declaration: string[]) {
    this.steps.push({
      name: declaration[2],
      type: declaration[1]
    });
  }

  parseActions(actions: string[]) {
    for (let action of actions) {
      const arr = action.split(" ");
      //TODO vérifier que arr contient bien 4 strings
      this.doAction(arr);
    }
    this.actions$.next(this.actions);
  }

  doAction(action: string[]) {
    //TODO vérifier que action[1] et action[3] sont bien des steps
    this.actions.push({
      stepStart: action[1],
      wording: action[2],
      stepEnd: action[3]
    })
  }
}
