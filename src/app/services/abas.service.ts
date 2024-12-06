import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbasService {

  itemAbaObservable: Subject<string> = new Subject <string>();
  constructor() { }

  addNovaAba(code: string) {
    this.itemAbaObservable.next(code);
  }
}
