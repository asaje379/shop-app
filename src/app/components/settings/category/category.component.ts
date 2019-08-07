import { LocalService } from './../../../services/local.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  @Output()
  emitCategorie = new EventEmitter<string>();
  value: string = '';
  msg : string = 'Sélectionné : ';

  categorie:string = '';
  sub: Subscription;
  sub2: Subscription;
  categories: any[] = [];
  mdlIsActive: boolean = false;
  categoriesFull = [];
  btn_text: string = 'Ajouter';
  category: any;

  constructor(
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.localService.initDbs('categories');
    this.sub = this.localService.subjects['categories'].subscribe(
      (data) => {
        this.categories = data;
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    this.btn_text == 'Ajouter' ? this.localService.save('categories', { 
      value: this.categorie, 
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now() 
    }, this.localService.categories).subscribe() : this.localService.save('categories', { 
      id: this.category.id,
      value: this.categorie, 
      createdAt: this.category.createdAt,
      isActive: true,
      lastUpdatedAt: Date.now() 
    }, this.localService.categories).subscribe();
    this.mdlIsActive = false;
    this.categorie = '';
  }

  applyFilter(filterValue: string) {
    let selected = [];

    if (filterValue.length != 0) {
      for (let c of this.categories) {
        if (c.value.toLowerCase().indexOf(filterValue.toLowerCase()) != -1) {
          selected.push(c);
        }
      }
      this.categories = selected;
    } else {
      this.init();
    }
  }

  setMdlActive() {
    this.categorie = '';
    this.mdlIsActive = true;
    this.btn_text = 'Ajouter';
  }

  onUpdate(c) {
    this.mdlIsActive = true;
    this.btn_text = 'Modifier';
    this.category = c;
    this.categorie = c.value;
  }

  onArchive(c) {
    if(confirm('Etes-vous sûr de vouloir effectuer cette opération ?')) {
      this.localService.save('categories', { 
        value: c.value, 
        isActive: false,
        lastUpdatedAt: Date.now() 
      }, this.localService.categories).subscribe();
    }
  }

  select(c) {
    this.value = c.value;
    this.emitCategorie.emit(this.value);
    this.msg = 'Sélectionné : ' + this.value;
    setTimeout(
      () => {
        this.value = '';
      }, 3000
    );
  }
}
