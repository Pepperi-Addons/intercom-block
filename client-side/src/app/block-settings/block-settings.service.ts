import { Injectable } from '@angular/core';
import { AddonService } from '../addon.service';
import { PepDialogData, PepDialogService, PepDialogActionButton } from '@pepperi-addons/ngx-lib/dialog';
import { ComponentType } from '@angular/cdk/overlay';


@Injectable({
  providedIn: 'root'
})

export class BlockSettingsService {

  dialogRef;

  constructor(
    private addonService: AddonService,
    private dialogService: PepDialogService
  ) {

  }

  async getPeperiProfiles() {
    return await this.addonService.pepGet(encodeURI('/Profiles')).toPromise();
  }

  async getPages() {
    return await this.addonService.pepGet(encodeURI('/Pages')).toPromise();
  }

  async getChatCustomizationList() {
    let url = `/addons/api/${this.addonService.addonUUID}/api/get_chat_customization_list`
    return await this.addonService.pepGet(encodeURI(url)).toPromise();
  }

  async upsertChatCustomization(profile) {
    return await this.addonService.pepPost(`/addons/api/${this.addonService.addonUUID}/api/upsert_chat_customization`, profile).toPromise();
  }

  async updateOnlineEndPoint(enable) {
    const obj = {
      "IsOnline": enable
    };
    return await this.addonService.pepPost(`/addons/api/${this.addonService.addonUUID}/api/update_cpi_table`, obj).toPromise();
  }

  async deleteChatCustomization(profilesToDelete) {
    return await this.addonService.pepPost(`/addons/api/${this.addonService.addonUUID}/api/delete_chat_customization`, profilesToDelete).toPromise();
  }

  // Dialog service 

  openDialog(title: string, content: ComponentType<any>, buttons: Array<PepDialogActionButton>, input: any, callbackFunc?: (any) => void): void {
    const dialogConfig = this.dialogService.getDialogConfig({ disableClose: true, panelClass: 'pepperi-standalone' }, 'inline')
    const data = new PepDialogData({ title: title, actionsType: 'custom', content: content, actionButtons: buttons })
    dialogConfig.data = data;

    this.dialogRef = this.dialogService.openDialog(content, input, dialogConfig);
    if (callbackFunc) {
      this.dialogRef.afterClosed().subscribe(res => {
        callbackFunc(res);
      });
    }
  }
}