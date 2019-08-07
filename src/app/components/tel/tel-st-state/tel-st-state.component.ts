import { LocalService } from './../../../services/local.service';
import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-tel-st-state',
  templateUrl: './tel-st-state.component.html',
  styleUrls: ['./tel-st-state.component.scss']
})
export class TelStStateComponent implements OnInit {

  subTels: Subscription;
  subCat: Subscription;
  tels = [];
  categories = [];
  filteredData = [];
  wait = true;

  constructor(
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.init().subscribe(d => {
      setTimeout(() => {
        this.filteredData = d;
        this.wait = false;
      }, 2000);
    });
  }

  init() {
    let ref = this;
    return new Observable<any[]>(observer => {
      const obsv = new Observable<any[]>(obs1 => {
        ref.localService.initDbs('tels');
        ref.subTels = ref.localService.subjects['tels'].subscribe(d => {
          obs1.next(d);
        });
      });
      obsv.subscribe((dt) => {
        ref.tels = dt;
        const ob = new Observable<any[]>(obs2 => {
          ref.localService.initDbs('categories');
          ref.subCat = ref.localService.subjects['categories'].subscribe(d => {
            obs2.next(d);
          });
        });
        ob.subscribe(d => {
          ref.categories = d;
          const op = new Observable<any[]>(o => {
            let s = [];
            for (let c of ref.categories) {
              s.push({
                id: c.value,
                values: ref.localService.filter(this.tels, 'category', c.value)
              });
            }
            o.next(s);
          });
          op.subscribe(d => {
            observer.next(d);
          });
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
      this.wait = true;
      this.init().subscribe(d => {
        setTimeout(() => {
          this.filteredData = d;
          this.wait = false;
        }, 2000);
      });
    }
  }
}
