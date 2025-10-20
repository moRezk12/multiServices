import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { LayoutComponent } from './Layouts/layout/layout.component';
import { ForgetpassComponent } from './Components/Auth/forgetpass/forgetpass.component';
import { ConfirmpassComponent } from './Components/Auth/confirmpass/confirmpass.component';
import { authGuard } from './Core/Guards/auth.guard';

import { ProvidersComponent } from './Components/Dashboard/users/providers/providers.component';
import { CustomerComponent } from './Components/Dashboard/users/customer/customer.component';
import { AddSupermarketComponent } from './Components/Dashboard/Supermarket/add-supermarket/add-supermarket.component';
import { AddSectionComponent } from './Components/Dashboard/Supermarket/add-section/add-section.component';
import { AdminComponent } from './Components/Dashboard/admin/admin.component';
import { RestaurantComponent } from './Components/Dashboard/Resturant/restaurant/restaurant.component';
import { AddProductComponent } from './Components/Dashboard/Resturant/add-product/add-product.component';
import { ProductSectionComponent } from './Components/Dashboard/Supermarket/product-section/product-section.component';
import { PrivacyPolicyComponent } from './Components/Dashboard/privacy-policy/privacy-policy.component';
import { SubscriptionComponent } from './Components/Dashboard/subscription/subscription.component';

const routes: Routes = [

  {path : '', redirectTo : 'login', pathMatch : 'full'},
  {path : 'login' , component : LoginComponent},
  {path : 'forgetpass' , component : ForgetpassComponent},
  {path : 'confirmpass' , component : ConfirmpassComponent},

  {path : '' , component : LayoutComponent,
  children : [
      {path : '' , redirectTo : 'admin', pathMatch : 'full'},
      {path : 'admin' , component: AdminComponent , canActivate : [authGuard]},

      // Users
      {path : 'provider' , component : ProvidersComponent , canActivate : [authGuard]},
      {path : 'customer' , component : CustomerComponent , canActivate : [authGuard] },

      // Resturant
      {path : 'restaurant' , component : RestaurantComponent , canActivate : [authGuard] },
      {path : 'add-product/:id' , component : AddProductComponent , canActivate : [authGuard] },

      // Supermarket
      {path : 'add-supermarket' , component : AddSupermarketComponent , canActivate : [authGuard] },
      {path : 'add-section/:id' , component : AddSectionComponent , canActivate : [authGuard] },
      {path : 'add-productSection/:id' , component : ProductSectionComponent , canActivate : [authGuard] },


      {path : 'privacy-policy' , component : PrivacyPolicyComponent , canActivate : [authGuard] },
      {path : 'subscription' , component : SubscriptionComponent , canActivate : [authGuard] },


    ],

  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
