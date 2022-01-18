import { Component, OnInit, Inject } from '@angular/core';
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import {TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockSettingsService } from '../block-settings/block-settings.service';
import { ProfileFormMode } from '../../../../shared/entities'

@Component({
  selector: 'app-add-profile-form',
  templateUrl: './add-profile-form.component.html',
  styleUrls: ['./add-profile-form.component.css']
})
export class AddProfileFormComponent implements OnInit {

  screenSize: PepScreenSizeType;
  dialogData: any;
  formMode: ProfileFormMode = 'Add';
  profilesOptions: { key: string, value: string }[] = [];
  pagesOptions: { key: string, value: string }[] = [];

  constructor(      
    private layoutService: PepLayoutService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<AddProfileFormComponent>,
    private blockSettingsService: BlockSettingsService,
    @Inject(MAT_DIALOG_DATA) public incoming: any) {
    this.layoutService.onResize$.subscribe(size => {
      this.screenSize = size;
    });
    this.dialogData = incoming.data;
    this.formMode = this.dialogData.FormMode;
   }

  ngOnInit() {
    this.initOptionsLists();
  }

  async initOptionsLists() {
    //init profiles list
    this.profilesOptions = this.dialogData.Profiles.map(profile => {
      return { key: profile.InternalID, value: profile.Name };
    });
    //init pages list
    this.pagesOptions = this.dialogData.Pages.map(page => {
      return { key: page.Key, value: page.Name };
    });
  }

  async onValueChanged(element, $event) {
    switch (element) {
      case 'Profile': {
        let profile = this.profilesOptions.filter(profile => profile.key == $event)
        this.dialogData.SelectedProfile = {"Name": profile[0].value, "ID": profile[0].key};
        break;
      }
      case 'Page': {
        let page = this.pagesOptions.filter(page => page.key == $event)
        this.dialogData.SelectedPage = {"Name": page[0].value, "Key": page[0].key};
        break;
      }
    }
  }

  onDoneButtonClicked() {
    if (this.dialogData.SelectedProfile) {
      this.dialogRef.close(this.dialogData);
    }
  }

  onCloseFormClicked() {
    this.dialogRef.close();
  }

}