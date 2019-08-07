import { LocalService } from './../../../services/local.service';
import { UserService } from './../../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from './../../../models/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  error_message: string = '';
  allUsers: User[] = [];
  redirectMessage = '';
  users: User[] = [];
  form: FormGroup;
  subLoc: Subscription;
  open = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private localservice: LocalService
  ) { }

  ngOnInit() {
    this.localservice.initDbs('users');
    this.subLoc = this.localservice.subjects['users'].subscribe(
      (data) => {
        this.users = data;
        if(this.users.length == 0) {
          this.redirectMessage = 'Première utilisation : Vous allez être rediriger pour créer un compte administrateur ...';
          setTimeout(() => {
            this.open = true;
          }, 3500);
        }
      }
    );

    this.initUserForm();
  }

  initUserForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnDestroy() {
    this.subLoc.unsubscribe();
  }

  onSubmit() {
    const userInfo = this.form.value;
    let findedUser = this.localservice.filter(this.users, 'username', userInfo.username);
    if (findedUser.length != 0) {
      if (findedUser[0].password == userInfo.password) {
        this.userService.setUser(findedUser[0]);
        this.router.navigate(['/home']);
      } else {
        this.error_message = 'Identifiant ou mot de passe invalide !';
        this.initUserForm();
        setTimeout(() => {
          this.error_message = '';
        }, 3000);
      }
    } else {
      this.error_message = 'Identifiant ou mot de passe invalide !';
      this.initUserForm();
      setTimeout(() => {
        this.error_message = '';
      }, 3000);
    }
  }

}
