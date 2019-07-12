import { Component, OnInit, Input, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommunicationService } from '../communication.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.css']
})
export class EditContentComponent implements OnInit {
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @ViewChild('fontSize', { static: false }) fontSize: any;
  textLine = 10;
  constructor(private fb: FormBuilder, private communication: CommunicationService, private ngZone: NgZone) { }
  textFormControl = new FormControl('', []);
  ngOnInit() {
    console.log(this.textFormControl);
    this.communication.previewToEditObserve.subscribe((res: string) => {
      this.textFormControl.setValue(res);
    });
    // TODO 默认是16
    this.textLine = Math.floor((document.documentElement.clientHeight - 300) / 16);
  }
  onWindowsResize(event) {
    this.textLine = Math.floor((event.target.innerHeight - 300) / parseInt(this.fontSize.value.replace('px', ''), 10));
  }

  submitContent(values: any) {
    console.log(values);
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  textareaChange() {
    this.communication.setContentToPreview(this.textFormControl.value);
  }
}
