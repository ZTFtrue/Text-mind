import { AfterViewInit, Component, Inject, NgZone, SecurityContext, ElementRef, ViewChild, Renderer2, Renderer } from '@angular/core';
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
  dialogTitle: string;
  @ViewChild('mathContent', { static: true }) mathContent: ElementRef;

  constructor(public dialogRef: MatDialogRef<DialogDetailsComponent>,
    // tslint:disable-next-line: align
    @Inject(MAT_DIALOG_DATA) public data: string, public cs: ConfigService, public detector: NgZone,
    private sanitizer: DomSanitizer, private renderer2: Renderer2) {
    const datatArrary = data.split('\n');
    datatArrary.reverse();
    this.dialogTitle = datatArrary.pop();
    this.dataContent = this.renderMd(datatArrary.reverse().join('\n\n'));
  }

  ngAfterViewInit() {
    this.mathJaxObject = this.cs.nativeGlobal().MathJax;
    this.renderer2.setProperty(this.mathContent.nativeElement, 'innerHTML', this.dataContent);
    this.renderMath();
  }

  renderMath() {
    this.mathJaxObject.Hub.Queue(['setRenderer', this.mathJaxObject.Hub, 'CommonHTML'],
      ['Typeset', this.mathJaxObject.Hub, this.mathContent.nativeElement], () => {
        this.detector.run(() => {
        });
      });
    // this.mathJaxObject.Hub.Queue(['setRenderer', this.mathJaxObject.Hub, 'SVG'],
    // ['Typeset', this.mathJaxObject.Hub, 'mathContent'], () => {
    //       this.detector.run(() => { this.renderFinish = true; });
    //     });
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
