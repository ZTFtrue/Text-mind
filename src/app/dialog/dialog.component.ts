import { AfterViewInit, Component, Inject, NgZone, SecurityContext } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../config.service';
import { DomSanitizer } from '@angular/platform-browser';
import marked from 'marked';
import highlight from 'highlight.js';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogDetailsComponent implements AfterViewInit {
  dataContent;
  mathJaxObject;
  renderFinish = false;
  dialogTitle: string;
  constructor(public dialogRef: MatDialogRef<DialogDetailsComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data: string, public cs: ConfigService, public detector: NgZone, private sanitizer: DomSanitizer) {
    const datatArrary = data.split('\n');
    datatArrary.reverse();
    this.dialogTitle = datatArrary.pop();
    this.dataContent = this.renderMd(datatArrary.reverse().join('\n\n'));
  }

  ngAfterViewInit() {
    this.mathJaxObject = this.cs.nativeGlobal().MathJax;
    this.loadMathConfig();
    this.renderMath();
  }

  renderMath() {
    this.mathJaxObject.Hub.Queue(['setRenderer', this.mathJaxObject.Hub, 'CommonHTML'],
      ['Typeset', this.mathJaxObject.Hub, 'mathContent'], () => {
        this.detector.run(() => { this.renderFinish = true; });
      });
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
        }
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
  closeDialog() {
    this.detector.run(() => { this.dialogRef.close(); });
  }

  renderMd(content: string) {
    // https://netbasal.com/angular-2-security-the-domsanitizer-service-2202c83bd90
    // Create reference instance

    // Set options
    // `highlight` example uses `highlight.js`
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: (code) => {
        return highlight.highlightAuto(code).value;
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });
    return this.sanitizer.sanitize(SecurityContext.HTML, marked(content));
  }
}
