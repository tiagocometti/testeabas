import { ComponentRef, ViewRef } from '@angular/core';

export interface IAbas {
  header: string;
  uniqueCode: string;
  conteudo: ComponentRef<any>;
  view: ViewRef;
}

export interface IAbasComponent {
  EstaAtivo: boolean;
  PodeFechar(): boolean;
}
