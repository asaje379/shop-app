import { LocalService } from './../../../services/local.service';
import { Subscription } from 'rxjs';
import { Article } from './../../../models/article';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tel-add',
  templateUrl: './tel-add.component.html',
  styleUrls: ['./tel-add.component.scss']
})
export class TelAddComponent implements OnInit {

  categorie: string = '';
  color: string = '';
  mark: string = '';
  tail: string = '';
  ref: string = '';
  state: string = '10';
  fournisseur = '';
  show: boolean = false;
  article = new Article();
  tels: [];
  ars: any[] = [];
  sub: Subscription;
  sub2: Subscription;

  constructor(
    private localService: LocalService
  ) { }

  init() {
    this.localService.initDbs('tels');
    this.sub = this.localService.subjects['tels'].subscribe(
      (data) => {
        this.tels = data;
      }
    );
  }

  ngOnInit() {
    this.localService.initDbs('tels');
    this.init();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showDetail() {
    this.ngOnInit();
    this.show = true;
  }

  update() {
    this.ngOnInit();
    this.show = false;
  }

  save() {
    this.localService.save('tels', {
      ref: this.ref,
      state: this.state,
      taille: this.tail,
      color: this.color,
      marque: this.mark,
      fournisseur: this.fournisseur,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now(),
      isActive: true,
      category: this.categorie
    }, this.localService.tels).subscribe();
    this.ref = this.state = '';
    this.color = '';
    this.mark = '';
    this.tail = '';
    this.categorie = '';
    this.fournisseur = '';
    this.state = '10';
  }
}
