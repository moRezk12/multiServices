import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Auth/login/login.component';
import { LayoutComponent } from './Layouts/layout/layout.component';
import { NavbarComponent } from './Layouts/navbar/navbar.component';
import { SidebarComponent } from './Layouts/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgetpassComponent } from './Components/Auth/forgetpass/forgetpass.component';
import { AuthInterceptor } from './Core/Interceptor/Auth/auth.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptor } from './Core/Interceptor/Loading/spinner.interceptor';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { ProvidersComponent } from './Components/Dashboard/users/providers/providers.component';
import { CustomerComponent } from './Components/Dashboard/users/customer/customer.component';
import { ConfirmpassComponent } from './Components/Auth/confirmpass/confirmpass.component';
import { AddSupermarketComponent } from './Components/Dashboard/Supermarket/add-supermarket/add-supermarket.component';
import { AddSectionComponent } from './Components/Dashboard/Supermarket/add-section/add-section.component';
import { AdminComponent } from './Components/Dashboard/admin/admin.component';
import { RestaurantComponent } from './Components/Dashboard/Resturant/restaurant/restaurant.component';
import { AddProductComponent } from './Components/Dashboard/Resturant/add-product/add-product.component';
import { ProductSectionComponent } from './Components/Dashboard/Supermarket/product-section/product-section.component';
import { PrivacyPolicyComponent } from './Components/Dashboard/privacy-policy/privacy-policy.component';
import { SubscriptionComponent } from './Components/Dashboard/subscription/subscription.component';
import { PaidServicesComponent } from './Components/Dashboard/paid-services/paid-services.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    ForgetpassComponent,
    ConfirmpassComponent,

    ProvidersComponent,
    CustomerComponent,
    RestaurantComponent,
    AddSupermarketComponent,
    AddSectionComponent,
    AddProductComponent,
    AdminComponent,
    ProductSectionComponent,
    PrivacyPolicyComponent,
    SubscriptionComponent,
    PaidServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule
  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true},
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
