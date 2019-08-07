import { LocalService } from 'src/app/services/local.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.scss']
})
export class NotifComponent implements OnInit {

  notifs: any[] = [];
  sub: Subscription;
  curNotif:any = {};
  open = false;


  constructor(
    private localService: LocalService,
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  init() {
    this.localService.initDbs('notifs');
    this.sub = this.localService.subjects['notifs'].subscribe(
      (data) => {
        this.notifs = data;
      }
    );
  }

  deleteAll() {
    for (let n of this.notifs) {
      n.isActive = false;
      this.localService.save('notifs', n, this.localService.notifs);
    }
  }

  select(notif) {
    this.curNotif = notif;
    this.open = true;
    this.curNotif.isRead = true;
    this.localService.save('notifs', this.curNotif, this.localService.notifs);
  }

}
