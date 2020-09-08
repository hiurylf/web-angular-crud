import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CustomerComponent} from './pages/customer-list/customer.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {CustomerEditComponent} from './pages/customer-edit/customer-edit.component';
import {HomeComponent} from './pages/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'customers', component: CustomerComponent},
  {path: 'customer', redirectTo: 'customers/:id'},
  {path: 'customer-edit', component: CustomerEditComponent},
  {path: 'customer-edit/:id', redirectTo: 'customers/:id'},
  {path: 'customer/:id', redirectTo: 'customers/:id'},
  {path: 'customers/:id', component: CustomerEditComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
