import { LocalService } from 'src/app/services/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  lib: string = '';
  sub: Subscription;
  articles = [];
  mdlIsActive: boolean = false;
  btn_text: string = 'Ajouter';
  art: any;
  quantite: number = 1;

  constructor(
    private localService : LocalService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.localService.initDbs('articles');
    this.sub = this.localService.subjects['articles'].subscribe(
      (data) => {
        this.articles = data;
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    this.btn_text == 'Ajouter' ? this.localService.save('articles', { 
      lib: this.lib, 
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now(),
      quantite: this.quantite 
    }, this.articles).subscribe() : this.localService.save('articles', { 
      id: this.art.id,
      lib: this.lib, 
      isActive: true,
      lastUpdatedAt: Date.now(),
      createdAt: this.art.createdAt,
      quantite: this.quantite  
    }, this.articles).subscribe();
    this.mdlIsActive = false;
    this.lib = '';
  }

  applyFilter(filternom: string) {
    let selected = [];

    if (filternom.length != 0) {
      for (let c of this.articles) {
        if (c.lib.toLowerCase().indexOf(filternom.toLowerCase()) != -1) {
          selected.push(c);
        }
      }
      this.articles = selected;
    } else {
      this.init();
    }
  }

}
