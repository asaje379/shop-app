import { Router } from '@angular/router';
import { LocalService } from 'src/app/services/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  @Output()
  emitColor = new EventEmitter<string>();
  value: string = '';
  msg : string = 'Sélectionné : ';

  color: string = '';
  sub: Subscription;
  sub2: Subscription;
  colors: { id: number, value: string }[] = [];
  mdlIsActive: boolean = false;
  colorsFull = [];
  btn_text: string = 'Ajouter';
  col: any;

  constructor(
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.localService.initDbs('colors');
    this.sub = this.localService.subjects['colors'].subscribe(
      (data) => {
        this.colors = data;
        console.log(data);
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    this.btn_text == 'Ajouter' ? this.localService.save('colors', { 
      value: this.color, 
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now() 
    }, this.localService.colors).subscribe() : this.localService.save('colors', { 
      id: this.col.id,
      value: this.color, 
      isActive: true,
      createdAt: this.col.createdAt,
      lastUpdatedAt: Date.now()
    }, this.localService.colors).subscribe();
    this.mdlIsActive = false;
    this.color = '';
  }

  applyFilter(filterValue: string) {
    let selected = [];

    if (filterValue.length != 0) {
      for (let c of this.colors) {
        if (c.value.toLowerCase().indexOf(filterValue.toLowerCase()) != -1) {
          selected.push(c);
        }
      }
      this.colors = selected;
    } else {
      this.init();
    }
  }

  setMdlActive() {
    this.color = '';
    this.mdlIsActive = true;
    this.btn_text = 'Ajouter';
  }

  onUpdate(c) {
    this.mdlIsActive = true;
    this.col = c;
    this.color = c.value;
    this.btn_text = 'Modifier';
  }

  onArchive(c) {
    if(confirm('Etes-vous sûr de vouloir effectuer cette opération ?')) {
      this.localService.save('colors', { 
        value: c.value, 
        isActive: false,
        lastUpdatedAt: Date.now() 
      }, this.localService.colors).subscribe();
    }
  }

  select(c) {
    this.value = c.value;
    this.emitColor.emit(this.value);
    this.msg = 'Sélectionné : ' + this.value;
    setTimeout(
      () => {
        this.value = '';
      }, 3000
    );
  }
}
