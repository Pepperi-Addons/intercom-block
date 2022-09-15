import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogType } from '../../../../shared/entities';

@Component({
  selector: 'addon-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  message: any;
  title: string;
  bottomButtonText: string;
  dialogType: DialogType;

  constructor(
      public dialogRef: MatDialogRef<MessageDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public incoming: any
  ) {
    this.message = incoming.data.Message;
    this.title = incoming.data.Title;
    this.bottomButtonText = incoming.data.ButtonText;
    this.dialogType = incoming.data.DialogType
   }

  ngOnInit() {
  }

  onCloseFormClicked() {
    this.dialogRef.close();
  }

  onDisableButtonClicked() {
    switch (this.dialogType) {
      case 'BeforeDisableOnline':
        this.dialogRef.close({"isOnlineAPIEnable": false})
        break;
      case 'BeforeRemove' :
        this.dialogRef.close({"shouldDelete": true});
        break
    }
  }
}
