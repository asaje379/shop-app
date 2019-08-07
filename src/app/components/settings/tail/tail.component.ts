import { LocalService } from './../../../services/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tail',
  templateUrl: './tail.component.html',
  styleUrls: ['./tail.component.scss']
})
export class TailComponent implements OnInit {

  @Output()
  emitTail = new EventEmitter<string>();
  value: string = '';
  msg : string = 'Sélectionné : ';

  taille: string = '';
  sub: Subscription;
  sub2: Subscription;
  tails: { id: string, value: string }[] = [];
  mdlIsActive: boolean = false;
  taillesFull = [];
  btn_text: string = 'Ajouter';
  tail: any;

  constructor(
    private localService : LocalService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.localService.initDbs('tails');
    this.sub = this.localService.subjects['tails'].subscribe(
      (data) => {
        this.tails = data;
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    this.btn_text == 'Ajouter' ? this.localService.save('tails', { 
      value: this.taille, 
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now() 
    }, this.tails).subscribe() : this.localService.save('tails', { 
      id: this.tail.id,
      value: this.taille, 
      isActive: true,
      lastUpdatedAt: Date.now(),
      createdAt: this.tail.createdAt 
    }, this.tails).subscribe();
    this.mdlIsActive = false;
    this.taille = '';
  }

  applyFilter(filterValue: string) {
    let selected = [];

    if (filterValue.length != 0) {
      for (let c of this.tails) {
        if (c.value.toLowerCase().indexOf(filterValue.toLowerCase()) != -1) {
          selected.push(c);
        }
      }
      this.tails = selected;
    } else {
      this.init();
    }
  }

  setMdlActive() {
    this.taille = '';
    this.mdlIsActive = true;
    this.btn_text = 'Ajouter';
  }

  onUpdate(c) {
    this.mdlIsActive = true;
    this.taille = c.value;
    this.btn_text = 'Modifier';
    this.tail = c;
  }

  onArchive(c) {
    if(confirm('Etes-vous sûr de vouloir effectuer cette opération ?')) {
      this.localService.save('tails', { 
        id: c.id, 
        value: c.value, 
        isActive: false,
        lastUpdatedAt: Date.now() 
      }, this.tails).subscribe();
    }
  }

  send(c) {
    this.value = c.value;
    this.emitTail.emit(this.value);
    this.msg = 'Sélectionné : ' + this.value;
    setTimeout(
      () => {
        this.value = '';
      }, 3000
    );
  }

}
