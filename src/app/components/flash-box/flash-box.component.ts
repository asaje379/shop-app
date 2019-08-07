import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flash-box',
  templateUrl: './flash-box.component.html',
  styleUrls: ['./flash-box.component.scss']
})
export class FlashBoxComponent implements OnInit {

  @Input() genre: string = '';
  @Input() content: string = '';

  open: boolean = true;

  constructor() { }

  ngOnInit() {
    setTimeout(
      () => {
        this.open = false;
      }, 3000
    );
  }

}
