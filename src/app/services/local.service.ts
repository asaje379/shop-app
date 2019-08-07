import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  db = [];
  subjects = [];
  users: any[] = [];
  fournisseurs: any[] = [];
  articles: any[] = [];
  colors: any[] = [];
  marks: any[] = [];
  factures: any[] = [];
  categories: any[] = [];
  tails: any[] = [];
  stocks: any[] = [];
  tels: any[] = [];
  notifs: any[] = [];

  transaction;
  objectStore;

  dbname: string = '';

  constructor() {
    this.init();
  }

  init() {
    this.subjects['users'] = new Subject<any[]>();
    this.subjects['fournisseurs'] = new Subject<any[]>();
    this.subjects['articles'] = new Subject<any[]>();
    this.subjects['colors'] = new Subject<any[]>();
    this.subjects['marks'] = new Subject<any[]>();
    this.subjects['factures'] = new Subject<any[]>();
    this.subjects['categories'] = new Subject<any[]>();
    this.subjects['tails'] = new Subject<any[]>();
    this.subjects['stocks'] = new Subject<any[]>();
    this.subjects['tels'] = new Subject<any[]>();
    this.subjects['notifs'] = new Subject<any[]>();
  }

  emitUsers() {
    this.subjects['users'].next(this.users.slice());
  }
  emitFournisseurs() {
    this.subjects['fournisseurs'].next(this.fournisseurs.slice());
  }
  emitArticles() {
    this.subjects['articles'].next(this.articles.slice());
  }
  emitColors() {
    this.subjects['colors'].next(this.colors.slice());
  }
  emitMarks() {
    this.subjects['marks'].next(this.marks.slice());
  }
  emitFactures() {
    this.subjects['factures'].next(this.factures.slice());
  }
  emitCategories() {
    this.subjects['categories'].next(this.categories.slice());
  }
  emitTails() {
    this.subjects['tails'].next(this.tails.slice());
  }
  emitStocks() {
    this.subjects['stocks'].next(this.stocks.slice());
  }
  emitTel() {
    this.subjects['tels'].next(this.tels.slice());
  }
  emitNotifs() {
    this.subjects['notifs'].next(this.notifs.slice());
  }

  createTable(dbname, fields: any[]): Observable<any> {
    return new Observable(obs => {
      let request = window.indexedDB.open(dbname, 1);
      request.onsuccess = () => {
        this.db[dbname] = request.result;
        obs.next(this.db[dbname]);
      }

      request.onupgradeneeded = (e: any) => {
        let db = e.target.result;

        let objectStore = db.createObjectStore(dbname, { keyPath: 'id', autoIncrement: true });

        for (let f of fields) {
          objectStore.createIndex(f.title, f.title, f.unique);
        }
      }
    });
  }

  save(dbname, item: any, array) {
    return new Observable(obs => {
      let transaction = this.db[dbname].transaction([dbname], 'readwrite');
      let objectStore = transaction.objectStore(dbname);
      objectStore.put(item);
      array = [];
      this.getAll(dbname, array).subscribe((value) => {
        this.subjects[dbname].next(value);
      });
      obs.next('Saved successfully');
    });
  }

  filter(array: any[], attr: string, value: string) {
    let selected = [];
    for (let item of array) {
      if (item[attr] == value) {
        selected.push(item);
      }
    }
    return selected;
  }

  getFilteredData(array: any[]) {
    let selected = [];
    for (let item of array) {
      if (item.isActive) {
        selected.push(item);
      }
    }
    return selected;
  }

  getAll(dbname, array) {
    return new Observable(obs => {
      let transactions = [];
      transactions['categories'] = this.db['categories'] ? this.db['categories'].transaction(['categories'], 'readwrite') : null;
      transactions['tails'] = this.db['tails'] ? this.db['tails'].transaction(['tails'], 'readwrite') : null;
      transactions['marks'] = this.db['marks'] ? this.db['marks'].transaction(['marks'], 'readwrite') : null;
      transactions['colors'] = this.db['colors'] ? this.db['colors'].transaction(['colors'], 'readwrite') : null;
      transactions['users'] = this.db['users'] ? this.db['users'].transaction(['users'], 'readwrite') : null;
      transactions['fournisseurs'] = this.db['fournisseurs'] ? this.db['fournisseurs'].transaction(['fournisseurs'], 'readwrite') : null;
      transactions['articles'] = this.db['articles'] ? this.db['articles'].transaction(['articles'], 'readwrite') : null;
      transactions['factures'] = this.db['factures'] ? this.db['factures'].transaction(['factures'], 'readwrite') : null;
      transactions['stocks'] = this.db['stocks'] ? this.db['stocks'].transaction(['stocks'], 'readwrite') : null;
      transactions['tels'] = this.db['tels'] ? this.db['tels'].transaction(['tels'], 'readwrite') : null;
      transactions['notifs'] = this.db['notifs'] ? this.db['notifs'].transaction(['notifs'], 'readwrite') : null;
      let objectStore = transactions[dbname].objectStore(dbname);

      array = [];
      if (this.db) {
        let request = objectStore.openCursor();
        request.onsuccess = (e: any) => {
          let cursor = e.target.result;
          if (cursor !== null) {
            if (cursor.value.isActive)
              array.push(cursor.value);
            cursor.continue();
          }
          obs.next(array);
        }
      }
    });
  }

  initDbs(dbname) {
    switch (dbname) {

      case 'users':
        // User's table creation
        this.createTable('users', [
          { title: 'username', unique: true },
          { title: 'password', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'isAdmin', unique: true },
          { title: 'isActive', unique: true },
        ]).subscribe((data) => {
          this.db['users'] = data;
          this.getAll('users', this.users).subscribe((value) => {
            this.subjects['users'].next(value);
          });
        });
        break;

      case 'fournisseurs':
        // Sellers's table creation
        this.createTable('fournisseurs', [
          { title: 'name', unique: true },
          { title: 'tel', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'lastUpdatedAt', unique: true }
        ]).subscribe((data) => {
          this.db['fournisseurs'] = data;
          this.getAll('fournisseurs', this.fournisseurs).subscribe((value) => {
            this.subjects['fournisseurs'].next(value);
          });
        });
        break;

      case 'articles':
        // Articles's table creation
        this.createTable('articles', [
          { title: 'lastUpdatedAt', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'isAdmin', unique: true },
          { title: 'isActive', unique: true },
          { title: 'lib', unique: true },
          { title: 'quantite', unique: true },
        ]).subscribe((data) => {
          this.db['article'] = data;
          this.getAll('articles', this.articles).subscribe((value) => {
            this.subjects['articles'].next(value);
          });
        });
        break;

      case 'tels':
        // Articles's table creation
        this.createTable('tels', [
          { title: 'category', unique: true },
          { title: 'color', unique: true },
          { title: 'lastUpdatedAt', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'isActive', unique: true },
          { title: 'state', unique: true },
          { title: 'marque', unique: true },
          { title: 'ref', unique: true },
          { title: 'taille', unique: true },
          { title: 'fournisseur', unique: true },
        ]).subscribe((data) => {
          this.db['tels'] = data;
          this.getAll('tels', this.tels).subscribe((value) => {
            this.subjects['tels'].next(value);
          });
        });
        break;

      case 'colors':
        // Color's table creation
        this.createTable('colors', [
          { title: 'lastUpdatedAt', unique: true },
          { title: 'value', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'isActive', unique: true },
        ]).subscribe((data) => {
          this.db['colors'] = data;
          console.log(this.db);
          this.getAll('colors', this.colors).subscribe((value) => {
            this.subjects['colors'].next(value);
          });
        });
        break;

      case 'categories':
        // Categories's table creation
        this.createTable('categories', [
          { title: 'lastUpdatedAt', unique: true },
          { title: 'value', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'isActive', unique: true },
        ]).subscribe((data) => {
          this.db['categories'] = data;
          this.getAll('categories', this.categories).subscribe((value) => {
            this.subjects['categories'].next(value);
          });
        });
        break;

      case 'tails':
        // Capacities's table creation
        this.createTable('tails', [
          { title: 'lastUpdatedAt', unique: true },
          { title: 'value', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'isActive', unique: true },
        ]).subscribe((data) => {
          this.db['tails'] = data;
          this.getAll('tails', this.tails).subscribe((value) => {
            this.subjects['tails'].next(value);
          });
        });
        break;

      case 'marks':
        // Mark's table creation
        this.createTable('marks', [
          { title: 'lastUpdatedAt', unique: true },
          { title: 'value', unique: true },
          { title: 'createdAt', unique: true },
          { title: 'isActive', unique: true },
        ]).subscribe((data) => {
          this.db['marks'] = data;
          this.getAll('marks', this.marks).subscribe((value) => {
            this.subjects['marks'].next(value);
          });
        });
        break;

      case 'factures':
        // Factures's table creation
        this.createTable('factures', [
          { title: 'client', unique: true },
          { title: 'tel', unique: true },
          { title: 'dateFacturation', unique: true },
          { title: 'montant', unique: true },
          { title: 'commandes', unique: true },
          { title: 'num', unique: true }
        ]).subscribe((data) => {
          this.db['factures'] = data;
          this.getAll('factures', this.factures).subscribe((value) => {
            this.subjects['factures'].next(value);
          });
        });
        break;

      case 'stocks':
        // Stock's table creation
        this.createTable('stocks', [
          { title: 'articles', unique: true },
          { title: 'createdAt', unique: true },
        ]).subscribe((data) => {
          this.db['stocks'] = data;
          this.getAll('stocks', this.stocks).subscribe((value) => {
            this.subjects['stocks'].next(value);
          });
        });
        break;

      case 'notifs':
        // Factures's table creation
        this.createTable('notifs', [
          { title: 'dateNotif', unique: true },
          { title: 'content', unique: true },
          { title: 'isActive', unique: true },
          { title: 'isRead', unique: true },
          { title: 'description', unique: true }
        ]).subscribe((data) => {
          this.db['notifs'] = data;
          this.getAll('notifs', this.notifs).subscribe((value) => {
            this.subjects['notifs'].next(value);
          });
        });
        break;
    }
  }
}
