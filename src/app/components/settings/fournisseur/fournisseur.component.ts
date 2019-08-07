import { LocalService } from 'src/app/services/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent implements OnInit {

  fournisseurs: any[] = [];
  nom: string = '';
  tel: string = '';
  sub: Subscription;
  fournisseursFull: any[] = [];

  constructor(
    private localService: LocalService,
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.localService.initDbs('fournisseurs');
    this.sub = this.localService.subjects['fournisseurs'].subscribe(
      (data) => {
        this.fournisseurs = data;
      }
    );
  }

  applyFilter($event) {
    let selected = [];

    if ($event.length != 0) {
      for (let user of this.fournisseurs) {
        if (user.nom.toLowerCase().indexOf($event.toLowerCase()) != -1) {
          selected.push(user);
        }
      }
      this.fournisseurs = selected;
    } else {
      this.init();
    }
  }

  addUser() {
    let user = {
      nom: this.nom,
      tel: this.tel,
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now()
    };

    this.localService.save('fournisseurs', user, this.localService.fournisseurs).subscribe();
    this.nom = this.tel = '';
  }

  delete(user) {
    if (confirm('Etes vous certain de vouloir effectuer cette action ?')) {
      user.isActive = false;
      this.localService.save('fournisseurs', user, this.localService.fournisseurs).subscribe();
    }
  }

}
