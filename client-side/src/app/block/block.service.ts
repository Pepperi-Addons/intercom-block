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

    async saveSecretKey(key: string, secretKey: string) {
        const obj = {
            "Key": key,
            "newSecretKey": secretKey
        };
        return await this.addonService.pepPost(`/addons/api/${this.addonService.addonUUID}/api/secret_key`, obj).toPromise();
    }

    async getUser(key) {
        let userUUID = this.addonService.parsedToken["pepperi.useruuid"]
        let url = `/addons/api/${this.addonService.addonUUID}/api/get_user_data?Key=${key}&UserUUID=${userUUID}`
        return await this.addonService.pepGet(encodeURI(url)).toPromise();
    }

    async isSecretKeyExist(key: string) {
        let url = `/addons/api/${this.addonService.addonUUID}/api/secret_key?Key=${key}`
        return await this.addonService.pepGet(encodeURI(url)).toPromise();
    }
}