import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericListComponent, GenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { TranslateService } from '@ngx-translate/core';
import { BlockSettingsService } from './block-settings.service'
import { ActivatedRoute } from '@angular/router';
import { AddonService } from '../addon.service';
import { AddProfileFormComponent } from '../add-profile-form/add-profile-form.component';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-block-settings',
  templateUrl: './block-settings.component.html',
  styleUrls: ['./block-settings.component.css']
})
export class BlockSettingsComponent implements OnInit {
  @ViewChild(GenericListComponent) genericList: GenericListComponent;

  isOnlineEnabled: boolean = false;
  onlineAPIButtonTitle: string = this.translate.instant("Enable");

  constructor(private translate: TranslateService,
    private addonService: AddonService,
    private blockSettingsService: BlockSettingsService,
    private route: ActivatedRoute) {
    this.addonService.addonUUID = this.route.snapshot.params.addon_uuid;
  }

  ngOnInit() {
  }

  noDataMessage: string;

  listDataSource: GenericListDataSource = {
    getList: async (state) => {
      return await this.blockSettingsService.getChatCustomizationList();
    },

    getDataView: async () => {
      return {
        Context: {
          Name: '',
          Profile: { InternalID: 0 },
          ScreenSize: 'Landscape'
        },
        Type: 'Grid',
        Title: 'Profile hierarchy appliies',
        Fields: [
          {
            FieldID: 'ProfileName',
            Type: 'TextBox',
            Title: this.translate.instant('Profile Name'),
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'PageName',
            Type: 'TextBox',
            Title: this.translate.instant('Page Name'),
            Mandatory: false,
            ReadOnly: true
          }
        ],
        Columns: [
          {
            Width: 50
          },
          {
            Width: 50
          }
        ],

        FrozenColumnsCount: 0,
        MinimumColumnWidth: 0
      }
    },

    getActions: async (objs) => {
      const actions = [];
      if (objs.length === 1) {
        actions.push({
          title: this.translate.instant("Edit"),
          handler: async (objs) => {
            this.openProfileForm('Edit', objs[0]);
          }
        });
      }
      if (objs.length >= 1) {
        actions.push({
          title: this.translate.instant("Delete"),
          handler: async (objs) => {
            let message = this.translate.instant("Before_Disable_Online_Message");
            let dialogData =  { 
              "Message": message,
              "Title": "",
              "ButtonText": this.translate.instant("Yes"),
              "DialogType": 'BeforeRemove' 
            }
            return this.blockSettingsService.openDialog("", MessageDialogComponent, [], { data: dialogData }, (data) => {
              if (data) {
                this.blockSettingsService.deleteChatCustomization(objs).then(() => {
                  this.genericList.reload();
                });
              }
            });
          }
        });
      }

      return actions;
    }
  }

  onOnlineEndpointButtonClicked() {
    if (this.isOnlineEnabled == true) {
      let message = this.translate.instant("Are_You_Sure_First_Line") + '\n' + this.translate.instant("Are_You_Sure_Second_Line");
      let dialogData = { 
        "Message": message,
        "Title": this.translate.instant("Disable_Form_Title"),
        "ButtonText":  this.translate.instant("Disable"),
        "DialogType": 'BeforeDisableOnline'  
      }
      return this.blockSettingsService.openDialog("", MessageDialogComponent, [], { data: dialogData }, (data) => {
        if (data) {
          this.isOnlineEnabled = false;
          this.blockSettingsService.updateOnlineEndPoint(this.isOnlineEnabled);
          this.onlineAPIButtonTitle = this.translate.instant("Enable");
        }
      });
    }
    else {
      this.isOnlineEnabled = true;
      this.blockSettingsService.updateOnlineEndPoint(this.isOnlineEnabled);
      this.onlineAPIButtonTitle = this.translate.instant("Disable");
    }
  }

  async openProfileForm(profileFormMode, profileData?) {
    let callback = async (data) => {
      if (data) {
        const profile = {
          "ProfileID": data.SelectedProfile.ID,
          "ProfileName": data.SelectedProfile.Name,
          "PageKey": data.SelectedPage.Key,
          "PageName": data.SelectedPage.Name,
          "Hidden": false
        };
        this.blockSettingsService.upsertChatCustomization(profile).then(() => {
          this.genericList.reload();
        });
      }
    }
    let profiles = await this.blockSettingsService.getPeperiProfiles();
    let pages = await this.blockSettingsService.getPages();
    let selectedProfile = { "Name": profileData?.ProfileName, "ID": profileData?.ProfileID };
    let selectedPage = { "Name": profileData?.PageName, "ID": profileData?.PageKey };
    let dialogData  = { 
      "Profiles": profiles,
      "Pages": pages,
      "FormMode": profileFormMode,
      "SelectedProfile": selectedProfile,
      "SelectedPage": selectedPage 
    } 
    return this.blockSettingsService.openDialog(this.translate.instant("Add Profile"), AddProfileFormComponent, [], { data: dialogData}, callback);
  }
}
