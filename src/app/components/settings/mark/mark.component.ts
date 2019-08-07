import { LocalService } from './../../../services/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.scss']
})
export class MarkComponent implements OnInit {

  @Output()
  emitMark = new EventEmitter<string>();
  value: string = '';
  msg : string = 'Sélectionné : ';

  marque: string = '';
  sub: Subscription;
  marks: { id: string, value: string }[] = [];
  mdlIsActive: boolean = false;
  btn_text: string = 'Ajouter';

  constructor(private service: LocalService, private router: Router) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.service.initDbs('marks');
    this.sub = this.service.subjects['marks'].subscribe(
      (data) => {
        this.marks = data;
      }
    );
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    this.btn_text == 'Ajouter' ? this.service.save('marks', { 
      value: this.marque, 
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now() 
    }, this.marks) : this.service.save('marks', { 
      value: this.marque, 
      isActive: true,
      lastUpdatedAt: Date.now() 
    }, this.marks);
    this.mdlIsActive = false;
    this.marque = '';
  }

  applyFilter(filterValue: string) {
    let selected = [];

    if (filterValue.length != 0) {
      for (let c of this.marks) {
        if (c.value.toLowerCase().indexOf(filterValue.toLowerCase()) != -1) {
          selected.push(c);
        }
      }
      this.marks = selected;
    } else {
      this.init();
    }
  }

  setMdlActive() {
    this.marque = '';
    this.mdlIsActive = true;
    this.btn_text = 'Ajouter';
  }

  onUpdate(c) {
    this.mdlIsActive = true;
    this.marque = c.value;
    this.btn_text = 'Modifier';
    this.marque = c;
  }

  onArchive(c) {
    if(confirm('Etes-vous sûr de vouloir effectuer cette opération ?')) {
      this.service.save('marks', { 
        id: c.id, 
        value: c.value, 
        isActive: false,
        lastUpdatedAt: Date.now() 
      }, this.marks);
    }
  }

  send(c) {
    this.value = c.value;
    this.emitMark.emit(this.value);
    this.msg = 'Sélectionné : ' + this.value;
    setTimeout(
      () => {
        this.value = '';
      }, 3000
    );
  }

}
