import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericListComponent, IPepGenericListActions, IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { TranslateService } from '@ngx-translate/core';
import { BlockSettingsService } from './block-settings.service'
import { ActivatedRoute } from '@angular/router';
import { AddonService } from '../addon.service';
import { AddProfileFormComponent } from '../add-profile-form/add-profile-form.component';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { ChangeDetectorRef } from '@angular/core';
import { PepColorService } from '@pepperi-addons/ngx-lib';
import { TestIntercomAPIDialogComponent } from '../test-intercom-api-dialog/test-intercom-api-dialog.component';
import { DUMMY_SECRET_KEY } from '../../../../shared/entities';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { config } from '../addon.config';

@Component({
  selector: 'app-block-settings',
  templateUrl: './block-settings.component.html',
  styleUrls: ['./block-settings.component.css']
})
export class BlockSettingsComponent implements OnInit {
  @ViewChild(GenericListComponent) genericList: GenericListComponent;
  @ViewChild('enableButton') enableButton: any;

  noDataMessage: string;
  presentedProfiles = [];
  onlineAPIButtonTitle: string;
  onlineAPIButtonStyleStateType: string;
  chatColor: string;
  isLoaded: boolean = false;
  token: string = '';
  onlineEndpointObj: {
    "Enable": boolean,
    "Token": string,
    "ChatColor": string
  };

  constructor(private translate: TranslateService,
    private addonService: AddonService,
    private blockSettingsService: BlockSettingsService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private colorService: PepColorService) {
    this.addonService.addonUUID = config.AddonUUID;
  }

  ngOnInit() {
    this.getOnlineEndpoint();
  }

  async getOnlineEndpoint() {
    this.onlineEndpointObj = await this.blockSettingsService.getOnlineEndpoint();

    if (this.onlineEndpointObj.ChatColor) {
      this.chatColor = this.colorService.convertHslToStringHsl(this.colorService.hex2hsl(this.onlineEndpointObj.ChatColor));
    }
    else {
      this.chatColor = this.colorService.convertHslToStringHsl(this.colorService.hex2hsl("#ccc"))
    }

    let isTokenExists = await this.blockSettingsService.isTokenExist();
    if (isTokenExists == true) {
      this.token = DUMMY_SECRET_KEY;
    }

    this.setOnlineAPIButtonUI()
    this.isLoaded = true;
    this.ref.detectChanges();
  }

  listDataSource: IPepGenericListDataSource = this.getDataSource();
  //   {
  //   getList: async (state) => {
  //     let chatCustomizationList = await this.blockSettingsService.getChatCustomizationList();
  //     this.presentedProfiles = chatCustomizationList.map(customization => customization.ProfileID);
  //     return chatCustomizationList;
  //   },

  //   getDataView: async () => {
  //     return {
  //       Context: {
  //         Name: '',
  //         Profile: { InternalID: 0 },
  //         ScreenSize: 'Landscape'
  //       },
  //       Type: 'Grid',
  //       Title: 'Profile hierarchy appliies',
  //       Fields: [
  //         {
  //           FieldID: 'ProfileName',
  //           Type: 'TextBox',
  //           Title: this.translate.instant('Profile Name'),
  //           Mandatory: false,
  //           ReadOnly: true
  //         },
  //         {
  //           FieldID: 'PageName',
  //           Type: 'TextBox',
  //           Title: this.translate.instant('Page Name'),
  //           Mandatory: false,
  //           ReadOnly: true
  //         }
  //       ],
  //       Columns: [
  //         {
  //           Width: 50
  //         },
  //         {
  //           Width: 50
  //         }
  //       ],

  //       FrozenColumnsCount: 0,
  //       MinimumColumnWidth: 0
  //     }
  //   },

  //   getActions: async (objs) => {
  //     const actions = [];
  //     if (objs.length === 1) {
  //       actions.push({
  //         title: this.translate.instant("Edit"),
  //         handler: async (objs) => {
  //           this.openProfileForm('Edit', objs[0]);
  //         }
  //       });
  //     }
  //     if (objs.length >= 1) {
  //       actions.push({
  //         title: this.translate.instant("Delete"),
  //         handler: async (objs) => {
  //           this.deleteChatConfiguration(objs)
  //         }
  //       });
  //     }

  //     return actions;
  //   }
  // }

  getDataSource() {
    return {
      init: async (params: any) => {
        let chatCustomizationList = await this.blockSettingsService.getChatCustomizationList();
        this.presentedProfiles = chatCustomizationList.map(customization => customization.ProfileID);
        return Promise.resolve({
          dataView: {
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
          },
          totalCount: chatCustomizationList.length,
          items: chatCustomizationList
        });
      },
      inputs: {
        pager: {
          type: 'scroll'
        },
        selectionType: 'multi',
        noDataFoundMsg: this.noDataMessage,
      },
    } as IPepGenericListDataSource
  }

  actions: IPepGenericListActions = {
    get: async (data: PepSelectionData) => {
      const actions = [];
      if (data && data.rows.length === 1) {
        actions.push({
          title: this.translate.instant("Edit"),
          handler: async (objs) => {
            this.openProfileForm('Edit', objs[0]);
          }
        });
      }
      if (data && data.rows.length >= 1) {
        actions.push({
          title: this.translate.instant("Delete"),
          handler: async (objs) => {
            this.deleteChatConfiguration(objs)
          }
        });
      }

      return actions;
    }
  }

  private deleteChatConfiguration(objs) {
    let message = this.translate.instant("Before_Disable_Online_Message");
    let dialogData = {
      "Message": message,
      "Title": "",
      "ButtonText": this.translate.instant("Yes"),
      "DialogType": 'BeforeRemove'
    }
    return this.blockSettingsService.openDialog("", MessageDialogComponent, [], { data: dialogData }, (data) => {
      if (data) {
        this.blockSettingsService.deleteChatCustomization(objs).then(() => {
          this.listDataSource = this.getDataSource();
        });
      }
    });
  }

  setOnlineAPIButtonUI() {
    if (this.onlineEndpointObj.Enable == true) {
      this.onlineAPIButtonTitle = this.translate.instant("Disable");
      this.onlineAPIButtonStyleStateType = 'caution';
    }
    else {
      this.onlineAPIButtonTitle = this.translate.instant("Enable");
      this.onlineAPIButtonStyleStateType = 'Success';
    }
    this.ref.detectChanges();
  }

  onOnlineEndpointButtonClicked() {
    if (this.onlineEndpointObj.Enable == true) {
      let message = this.translate.instant("Are_You_Sure_First_Line") + '\n' + this.translate.instant("Are_You_Sure_Second_Line");
      let dialogData = {
        "Message": message,
        "Title": this.translate.instant("Disable_Form_Title"),
        "ButtonText": this.translate.instant("Disable"),
        "DialogType": 'BeforeDisableOnline'
      }
      return this.blockSettingsService.openDialog("", MessageDialogComponent, [], { data: dialogData }, (data) => {
        if (data) {
          this.onlineEndpointObj.Enable = false;
          this.blockSettingsService.updateOnlineEndPoint(this.onlineEndpointObj);
          this.setOnlineAPIButtonUI();
        }
      });
    }
    else {
      this.onlineEndpointObj.Enable = true;
      this.blockSettingsService.updateOnlineEndPoint(this.onlineEndpointObj);
      this.setOnlineAPIButtonUI();
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
          this.listDataSource = this.getDataSource();
        });
      }
    }
    let profiles = await this.blockSettingsService.getPeperiProfiles();
    let pages = await this.blockSettingsService.getPages();
    let selectedProfile = { "Name": profileData?.ProfileName, "ID": profileData?.ProfileID };
    let selectedPage = { "Name": profileData?.PageName, "ID": profileData?.PageKey };
    let dialogData = {
      "Profiles": profiles,
      "Pages": pages,
      "FormMode": profileFormMode,
      "SelectedProfile": selectedProfile,
      "SelectedPage": selectedPage,
      "PresentedProfiles": this.presentedProfiles
    }
    return this.blockSettingsService.openDialog(this.translate.instant("Add Profile"), AddProfileFormComponent, [], { data: dialogData }, callback);
  }

  onSaveTokenClicked() {
    if (this.token && this.token != "") {
      this.onlineEndpointObj.Token = this.token;
      this.blockSettingsService.saveToken(this.onlineEndpointObj);
    }
  }

  onTestTokenClicked() {
    let dialogData = {};
    this.blockSettingsService.openDialog("", TestIntercomAPIDialogComponent, [], { data: dialogData }, (data) => {
      if (data) {
        this.onlineEndpointObj.Enable = false;
        this.onlineAPIButtonTitle = this.translate.instant("Enable");
        this.enableButton.styleStateType = 'Success';
        this.blockSettingsService.updateOnlineEndPoint(this.onlineEndpointObj);
      }
    });
  }

  onSaveColorClicked() {
    if (this.onlineEndpointObj.ChatColor) {
      this.blockSettingsService.updateOnlineEndPoint(this.onlineEndpointObj);
    }
  }

  async onColorChanged($event) {
    this.onlineEndpointObj.ChatColor = this.colorService.hsl2hex(this.colorService.hslString2hsl($event));
  }
}
