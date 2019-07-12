import { Directive, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[appWindowEvent]'
})
export class WindowEventDirective {

  @Output() windowOnResize = new EventEmitter();
  constructor() {
  }

  @HostListener('window:resize', ['$event']) onWindowsResize(event: any) {
    this.windowOnResize.emit(event);
  }

}
