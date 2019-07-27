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
export class AppComponent implements AfterViewInit, OnInit {

  selected = new FormControl(0);
  lastSelect = 0;
  mathJaxObject;

  constructor(private communication: CommunicationService, public cs: ConfigService) {

  }

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.mathJaxObject = this.cs.nativeGlobal().MathJax;
    this.loadMathConfig();
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
  loadMathConfig() {
    this.mathJaxObject.Hub.Config({
      showMathMenu: false,
      tex2jax: {
        inlineMath: [
          ['$', '$']
        ],
        displayMath: [
          ['$$', '$$']
        ]
      },
      CommonHTML: {
        linebreaks: {
          automatic: true
        }
      },
      'HTML-CSS': {
        linebreaks: {
          automatic: true
        },
      },
      SVG: {
        linebreaks: {
          automatic: true
        },
        mtextFontInherit: true,
        blacker: 1,
      },
      // extensions: ['tex2jax.js', 'TeX/AMSmath.js'],
      // jax: ['input/TeX', 'output/SVG'],
      jax: ['input/MathML', 'output/SVG'],
      extensions: ['mml2jax.js', 'MathEvents.js'],
      MathML: {
        extensions: ['content-mathml.js']
      },
      menuSettings: {
        zoom: 'None'
      },
      MatchWebFonts: {
        matchFor: {
          SVG: true
        },
        fontCheckDelay: 500,
        fontCheckTimeout: 15 * 1000
      },
      messageStyle: 'none'
    });
  }
}
