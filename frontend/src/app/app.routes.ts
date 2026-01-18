import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login.component';
import { CheckoutComponent } from './checkout.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'tienda', component: ProductListComponent, data: { animation: 'TiendaPage' } },
  { path: 'producto/:id', component: ProductDetailComponent, data: { animation: 'DetailPage' } },
  { path: 'checkout', component: CheckoutComponent, data: { animation: 'CheckoutPage' } },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard], data: { animation: 'AdminPage' } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
