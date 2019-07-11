import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private editToPreview = new Subject<string>();
  private previewToEdit = new Subject<string>();
  private refreshPreview = new Subject<boolean>();
  editToPreviewObserve = this.editToPreview.asObservable();
  previewToEditObserve = this.previewToEdit.asObservable();
  refreshPreviewObserve = this.refreshPreview.asObservable();
  constructor() { }
  public setContentToPreview(message: string) {
    this.editToPreview.next(message);
  }
  public setContentToEdit(message: string) {
    this.previewToEdit.next(message);
  }
  public setRefreshPreview(message: boolean) {
    this.refreshPreview.next(message);
  }

}
