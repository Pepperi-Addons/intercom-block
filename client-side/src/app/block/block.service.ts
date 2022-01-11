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

    async saveSecretKey(secretKey) {
        return await this.addonService.pepPost(`/addons/api/${this.addonService.addonUUID}/api/save_secret_key`, secretKey).toPromise();
    }

    async getUserHash(email: string) {
        let url = `/addons/api/${this.addonService.addonUUID}/api/get_user_hash?Email=${email}`
        return this.addonService.pepGet(encodeURI(url)).toPromise();
    }

    async getUser() {
        return await this.addonService.getUser();
    }
}