import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DialogDetailsComponent } from './dialog/dialog.component';
import { MouseWheelDirective } from './mouse-wheel.directive';

@NgModule({
  declarations: [
    AppComponent,
    DialogDetailsComponent,
    MouseWheelDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  entryComponents: [
    DialogDetailsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
