import { HomeComponent } from './components/home/home.component';
import { SellingComponent } from './components/selling/selling.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PapaParseModule } from 'ngx-papaparse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './components/settings/category/category.component';
import { TailComponent } from './components/settings/tail/tail.component';
import { MarkComponent } from './components/settings/mark/mark.component';
import { FlashBoxComponent } from './components/flash-box/flash-box.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ColorComponent } from './components/settings/color/color.component';
import { BaseComponent } from './components/settings/base/base.component';
import { FlashErrorComponent } from './components/flash-error/flash-error.component';
import { FournisseurComponent } from './components/settings/fournisseur/fournisseur.component';
import { FRComponent } from './components/settings/f-r/f-r.component';
import { TelComponent } from './components/tel/tel.component';
import { TelAddComponent } from './components/tel/tel-add/tel-add.component';
import { TelStStateComponent } from './components/tel/tel-st-state/tel-st-state.component';
import { ToolsComponent } from './components/tools/tools.component';
import { NotifComponent } from './components/notif/notif.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    TailComponent,
    MarkComponent,
    FlashBoxComponent,
    SigninComponent,
    LoginComponent,
    SellingComponent,
    HomeComponent,
    ColorComponent,
    BaseComponent,
    FlashErrorComponent,
    FournisseurComponent,
    FRComponent,
    TelComponent,
    TelAddComponent,
    TelStStateComponent,
    ToolsComponent,
    NotifComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PapaParseModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
