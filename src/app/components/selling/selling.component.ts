import { LocalService } from './../../services/local.service';
import { Article } from './../../models/article';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import printJS from 'print-js';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss']
})
export class SellingComponent implements OnInit, OnDestroy {

  articles: any[] = [];
  sub: Subscription;
  subFact: Subscription;
  subTel: Subscription;
  error: string = '';
  show = false;

  curArticle: Article = new Article();

  prix: number = 5;
  quantite: number = 1;
  facture = {
    client: null,
    tel: null,
    commandes: [],
    dateFacturation: Date.now(),
    montant: 0,
    num: null
  };
  factures: any[] = [];

  tels: any[] = [];
  curTel: any;
  art = '';
  num = 0;
  subb: Subscription;

  constructor(
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.iinit();
    this.localService.initDbs('notifs');
    
  }

  iinit() {
    this.localService.initDbs('articles');
    this.sub = this.localService.subjects['articles'].subscribe(
      (data) => {
        this.articles = data;
      }
    );
    this.localService.initDbs('factures');
    this.subFact = this.localService.subjects['factures'].subscribe(
      (dt) => {
        this.factures = dt;
        this.num = dt.length + 1;
      }
    );
    this.localService.initDbs('tels');
    this.subTel = this.localService.subjects['tels'].subscribe(d => {
      this.tels = d;
    });
    this.localService.initDbs('notifs');
    this.subb = this.localService.subjects['notifs'].subscribe();
  }

  check($event) {
    if (this.quantite > this.curArticle.quantite) {
      this.error = 'Erreur : Il ne reste que ' + this.curArticle.quantite + ' ' + this.curArticle.lib + '(s) en stock !';
    } else {
      this.error = '';
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subFact.unsubscribe();
    this.subTel.unsubscribe();
    this.subb.unsubscribe();
  }

  select(article) {
    this.curArticle = article;
    this.art = this.curArticle.lib;
  }

  selectTel(tel) {
    this.curTel = tel;
    this.art = this.curTel.ref;
  }

  genId() {
    if (this.factures.length == 0) {
      return 1;
    } else {
      return this.factures[this.factures.length - 1].num + 1;
    }
  }

  init() {
    this.curArticle = new Article();
    this.curTel = {};
    this.prix = 5;
    this.quantite = 1;
    this.art = '';
  }

  initAll() {
    this.facture = {
      num: null,
      client: null,
      tel: null,
      commandes: [],
      dateFacturation: Date.now(),
      montant: 0
    };
    this.init();
  }

  next() {
    if (this.facture.commandes.length == 0)
      this.facture.num = this.genId();
    this.facture.commandes.push({
      article: this.curArticle.lib != null ? this.curArticle : this.curTel,
      prix: this.prix,
      quantite: this.quantite
    });
    this.facture.montant += this.prix * this.quantite;
    this.init();
  }

  applyFilter($e) {
    let selected = [];
    if ($e.length != 0) {
      for (let a of this.articles) {
        if (a.lib.toLowerCase().indexOf($e.toLowerCase()) != -1) {
          selected.push(a);
        }
      }
      this.articles = selected;
    } else {
      this.iinit();
    }
  }

  applyTelsFilter($e) {
    let selected = [];
    if ($e.length != 0) {
      for (let t of this.tels) {
        if (t.ref.toLowerCase().indexOf($e.toLowerCase()) != -1 ||
          t.category.toLowerCase().indexOf($e.toLowerCase()) != -1) {
          selected.push(t);
        }
      }
      this.tels = selected;
    } else {
      this.iinit();
    }
  }

  print() {
    printJS({
      printable: "facture",
      type: "html",
      css: "assets/print.css"
    });
  }

  terminate() {
    for (let a of this.facture.commandes) {
      if (a.article.lib) {
        a.article.quantite = a.article.quantite - a.quantite;
        if (a.article.quantite <= 0) {
          a.article.isActive = false;
          this.error = 'La quantité en stock de ' + a.article.lib + ' est épuisée. Veuillez charger à nouveau.';
          let notif = {
            dateNotif: Date.now(),
            content: this.error,
            isActive: true,
            isRead: false,
            description: a.article.lib+'s épuisés en stock'
          };
          this.localService.save('notifs', notif, this.localService.notifs).subscribe();
        }
        a.article.lastUpdatedAt = Date.now();
        this.localService.save('articles', a.article, this.localService.articles).subscribe();
      } else {
        a.article.isActive = false;
        a.article.lastUpdatedAt = Date.now();
        this.localService.save('tels', a.article, this.localService.tels).subscribe();
      }
    }
    console.log(this.facture);
    this.localService.save('factures', this.facture, this.localService.factures).subscribe();
    this.show = true;
  }

  annuler() {
    this.init();
    this.error = '';
    this.facture = {
      num: null,
      client: null,
      tel: null,
      commandes: [],
      dateFacturation: Date.now(),
      montant: 0
    };
  }
}
