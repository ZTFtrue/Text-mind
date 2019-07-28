import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommunicationService } from './communication.service';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  selected = new FormControl(0);
  lastSelect = 0;
  mathJaxObject;

  constructor(private communication: CommunicationService) {

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
