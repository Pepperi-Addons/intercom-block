import { Component, OnInit, Inject } from '@angular/core';
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import {TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    //Profile list should include only profiles that are not in the table
    this.profilesOptions = this.profilesOptions.filter(profile => !this.dialogData.PresentedProfiles.includes(profile.key))

    //init pages list
    this.pagesOptions = this.dialogData.Pages.map(page => {
      return { key: page.Key, value: page.Name };
    });
  }

  async onValueChanged(element, $event) {
    switch (element) {
      case 'Profile': {
        let profile = this.profilesOptions.find(profile => profile.key == $event)
        this.dialogData.SelectedProfile = {"Name": profile.value, "ID": profile.key};
        break;
      }
      case 'Page': {
        let page = this.pagesOptions.find(page => page.key == $event);
        this.dialogData.SelectedPage = {"Name": page.value, "Key": page.key};
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