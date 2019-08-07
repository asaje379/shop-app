import { LocalService } from './../../../services/local.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-tel-st-state',
  templateUrl: './tel-st-state.component.html',
  styleUrls: ['./tel-st-state.component.scss']
})
export class TelStStateComponent implements OnInit, OnDestroy {

  subTels: Subscription;
  subCat: Subscription;
  tels = [];
  categories = [];
  filteredData = [];

  constructor(
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.localService.initDbs('tels');
    this.localService.initDbs('categories');
    this.init().subscribe(d => {
      this.filteredData = d;
      for (let i = 0; i < this.filteredData.length; ++i) {
        if (this.filteredData[i].values.length == 0) {
          this.filteredData.splice(i, 1);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subCat.unsubscribe();
    this.subTels.unsubscribe();
  }

  init() {
    let ref = this;
    return new Observable<any[]>(observer => {
      ref.subTels = ref.localService.subjects['tels'].subscribe(dt => {
        ref.tels = dt;
        ref.subCat = ref.localService.subjects['categories'].subscribe(dc => {
          ref.categories = dc;
          let s = [];
          for (let c of ref.categories) {
            let v = ref.localService.filter(this.tels, 'category', c.value);
            if (v.length != 0)
              s.push({
                id: c.value,
                values: v
              });
          }
          observer.next(s);
        });
      });
    });
  }

  applyFilter($event) {
    let selected = [];

    if ($event.length != 0) {
      for (let c of this.filteredData) {
        if (c.id.toLowerCase().indexOf($event.toLowerCase()) != -1) {
          selected.push(c);
        }
      }
      this.filteredData = selected;
    } else {
      this.ngOnInit();
    }
  }
}
