import { Injectable } from '@angular/core';
import { AddonService } from '../addon.service';


@Injectable({
    providedIn: 'root'
})

export class BlockService {

    constructor(
        private addonService: AddonService
    )  {
          
    }

    async saveSecretKey(appId: string, secretKey: string) {
        const obj = {
            "appID": appId,
            "newSecretKey": secretKey
        };
        return await this.addonService.pepPost(`/addons/api/${this.addonService.addonUUID}/api/save_secret_key`, obj).toPromise();
    }

    async getUserHash(email: string, appId) {
        let url = `/addons/api/${this.addonService.addonUUID}/api/get_user_hash?Email=${email}&AppId=${appId}`
        return await this.addonService.pepGet(encodeURI(url)).toPromise();
    }

    async getUser(appId) {
        let user = await this.addonService.getUser();
        let userHash = await this.getUserHash(user.Email, appId)
        return { "FirstName": user.FirstName, "Email": user.Email, "UserHash": userHash}
    }
}