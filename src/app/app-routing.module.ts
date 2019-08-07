import { FRComponent } from './components/settings/f-r/f-r.component';
import { ToolsComponent } from './components/tools/tools.component';
import { TelStStateComponent } from './components/tel/tel-st-state/tel-st-state.component';
import { TelAddComponent } from './components/tel/tel-add/tel-add.component';
import { BaseComponent } from './components/settings/base/base.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { ColorComponent } from './components/settings/color/color.component';
import { TailComponent } from './components/settings/tail/tail.component';
import { MarkComponent } from './components/settings/mark/mark.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { CategoryComponent } from './components/settings/category/category.component';
import { SellingComponent } from './components/selling/selling.component';
import { TelComponent } from './components/tel/tel.component';
import { NotifComponent } from './components/notif/notif.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'selling', component: SellingComponent },
      { path: 'tools', component: ToolsComponent },
      { path: 'notif', component: NotifComponent },
      {
        path: 'params',
        component: BaseComponent,
        children: [
          { path: 'signin', component: SigninComponent },
          { path: 'fournisseur', component: FRComponent },
          { path: 'category', component: CategoryComponent },
          { path: 'marque', component: MarkComponent },
          { path: 'taille', component: TailComponent },
          { path: 'color', component: ColorComponent },
        ]
      },
      {
        path: 'tel', component: TelComponent, children: [
          { path: 'add', component: TelAddComponent },
          { path: 'st-state', component: TelStStateComponent }
        ]
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
