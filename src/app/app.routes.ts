import { Routes } from '@angular/router';
import { ProfissionalComponent } from './profissional/profissional.component'; // Adicionado para suportar o componente Profissional
import { EmpresaComponent } from './empresa/empresa.component'; // Adicionado para suportar o componente Empresa
import { LeigoComponent } from './leigo/leigo.component'; // Adicionado para suportar o componente Leigo
import { ControleAbasComponent } from './controle-abas/controle-abas.component';

export const routes: Routes = [
  {
    path: 'profissional/:query', // Adicionado para rotas dinâmicas do componente Profissional
    component: ProfissionalComponent,
  },
  {
    path: 'empresa/:query', // Adicionado para rotas dinâmicas do componente Empresa
    component: EmpresaComponent,
  },
  {
    path: 'leigo/:query', // Adicionado para rotas dinâmicas do componente Leigo
    component: LeigoComponent,
  },
  { path: ':uniqueCode/:functionality', component: ControleAbasComponent }, // Suporte a uniqueCode e funcionalidade
  { path: ':uniqueCode', component: ControleAbasComponent }, // Suporte apenas ao uniqueCode
];
