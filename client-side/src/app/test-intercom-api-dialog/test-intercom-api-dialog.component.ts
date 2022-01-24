import { Component, OnInit } from '@angular/core';
import { BlockSettingsService } from '../block-settings/block-settings.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-test-intercom-api-dialog',
  templateUrl: './test-intercom-api-dialog.component.html',
  styleUrls: ['./test-intercom-api-dialog.component.css']
})
export class TestIntercomAPIDialogComponent implements OnInit {

  email: string;
  response: string;

  constructor(  
    private dialogRef: MatDialogRef<TestIntercomAPIDialogComponent>,
    private ref: ChangeDetectorRef,
    private blockSettingsService: BlockSettingsService) {
    
   }

  ngOnInit() {
  }

  onCloseFormClicked() {
    this.dialogRef.close();
  }

  async onTestButtonClicked() {
    if(this.email) {
      let testResponse = await this.blockSettingsService.testIntercomAPI(this.email)
      this.response = JSON.stringify(testResponse);
      this.ref.detectChanges();
    }
  }

}
