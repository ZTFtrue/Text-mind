import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommunicationService } from './communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit, OnInit {

  selected = new FormControl(0);
  lastSelect = 0;

  constructor(private communication: CommunicationService) {

  }

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }
  tabSelectedIndexChanage(event: any) {
    if (this.lastSelect !== this.selected.value) {
      this.lastSelect = this.selected.value;
      if (this.lastSelect === 0) {
        // 通知刷新
        this.communication.setRefreshPreview(true);
      }
    }
  }
}
