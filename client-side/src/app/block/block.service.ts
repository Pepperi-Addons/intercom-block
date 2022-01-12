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

    async getUser(appId) {
        let userUUID = this.addonService.parsedToken["pepperi.useruuid"]
        let url = `/addons/api/${this.addonService.addonUUID}/api/get_user_data?AppId=${appId}&UserUUID=${userUUID}`
        return await this.addonService.pepGet(encodeURI(url)).toPromise();
    }
}