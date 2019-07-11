import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule, MatSelectModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogDetailsComponent } from './dialog/dialog.component';
import { MouseWheelDirective } from './mouse-wheel.directive';
import { EditContentComponent } from './edit-content/edit-content.component';
import { ShowContentComponent } from './show-content/show-content.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogDetailsComponent,
    MouseWheelDirective,
    EditContentComponent,
    ShowContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers: [],
  entryComponents: [
    DialogDetailsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
