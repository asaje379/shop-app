import { LocalService } from 'src/app/services/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-f-r',
  templateUrl: './f-r.component.html',
  styleUrls: ['./f-r.component.scss']
})
export class FRComponent implements OnInit {
  @Output()
  emitFournisseur = new EventEmitter<string>();
  nom: string = '';
  msg : string = 'Sélectionné : ';

  fournisseur: string = '';
  sub: Subscription;
  sub2: Subscription;
  fournisseurs = [];
  mdlIsActive: boolean = false;
  btn_text: string = 'Ajouter';
  fourn: any;
  tel: string = '';

  constructor(
    private localService : LocalService
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    this.btn_text == 'Ajouter' ? this.localService.save('fournisseurs', { 
      nom: this.fournisseur, 
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now(),
      tel: this.tel 
    }, this.fournisseurs).subscribe() : this.localService.save('fournisseurs', { 
      id: this.fourn.id,
      nom: this.fournisseur, 
      isActive: true,
      lastUpdatedAt: Date.now(),
      createdAt: this.fourn.createdAt,
      tel: this.tel  
    }, this.fournisseurs).subscribe();
    this.mdlIsActive = false;
    this.fournisseur = '';
  }

  applyFilter(filternom: string) {
    let selected = [];

    if (filternom.length != 0) {
      for (let c of this.fournisseurs) {
        if (c.nom.toLowerCase().indexOf(filternom.toLowerCase()) != -1) {
          selected.push(c);
        }
      }
      this.fournisseurs = selected;
    } else {
      this.init();
    }
  }

  setMdlActive() {
    this.fournisseur = '';
    this.mdlIsActive = true;
    this.btn_text = 'Ajouter';
  }

  onUpdate(c) {
    this.mdlIsActive = true;
    this.btn_text = 'Modifier';
    this.fourn = c;
  }

  onArchive(c) {
    if(confirm('Etes-vous sûr de vouloir effectuer cette opération ?')) {
      this.localService.save('fournisseurs', { 
        id: c.id, 
        nom: c.nom, 
        tel: c.tel,
        isActive: false,
        lastUpdatedAt: Date.now() 
      }, this.fournisseurs).subscribe();
    }
  }

  send(c) {
    this.nom = c.nom;
    this.emitFournisseur.emit(this.nom);
    this.msg = 'Sélectionné : ' + this.nom;
    setTimeout(
      () => {
        this.nom = '';
      }, 3000
    );
  }

}
