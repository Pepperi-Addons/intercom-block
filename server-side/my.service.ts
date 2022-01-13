import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { DUMMY_SECRET_KEY, BLOCK_META_DATA_TABLE_NAME } from '../shared/entities';
import * as encryption from '../shared/encryption-service'

class MyService {

    papiClient: PapiClient
    addonSecretKey: string
    addonUUID: string;

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.AddonUUID,
        });
        this.addonSecretKey = client.AddonSecretKey ?? "";
        this.addonUUID = client.AddonUUID;
    }

    doSomething() {
        console.log("doesn't really do anything....");
    }

    // For page block template
    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }

    crateADALTable(table): Promise<any> {
        return this.papiClient.post('/addons/data/schemes', table);
    }

    // in case the object have a dummy secret key, we need to take care and don't save it.
    // so when we have a dummy secret key, we remove it from the object, and the upsert to ADAL will not change the current secret key
    async handleSecretKey(data: any) {
        if (data.Key) {
            let currentDataBlock;
            try {
                currentDataBlock = await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_META_DATA_TABLE_NAME).get(data.Key)
            }
            catch {
                currentDataBlock = {};
            }

            if (data.newSecretKey == DUMMY_SECRET_KEY) {
                if (currentDataBlock.SecretKey && currentDataBlock.SecretKey.length <= 0) {
                    throw new Error(`Secret key can't be ${data.newSecretKey}`);
                }
            }
            else if (data.newSecretKey && data.newSecretKey.length > 0) { // real secret key
                let enctyptedSecretKey = encryption.encryptSecretKey(data.newSecretKey, this.addonSecretKey)
                currentDataBlock.Key = data.Key;
                currentDataBlock.SecretKey = enctyptedSecretKey;
                await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_META_DATA_TABLE_NAME).upsert(currentDataBlock);
            }
            else {
                currentDataBlock.SecretKey = "";
                await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_META_DATA_TABLE_NAME).upsert(currentDataBlock);
            }
        }
        else {
            throw new Error(`Key is required`);
        }
    }

    async getUserData(query) {
        const user = await this.papiClient.get(`/users/uuid/${query.UserUUID}`);
        try {
            const data = await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_META_DATA_TABLE_NAME).get(query.Key);
            if (data.SecretKey) {
                let secretKey = await encryption.decryptSecretKey(data.SecretKey, this.addonSecretKey)
                const userHash = await encryption.HMAC(secretKey, user.Email)
                return { "FirstName": user.FirstName, "Email": user.Email, "UserHash": userHash }
            }
            else {
                throw new Error(`secretKey does not exist`);
            }
        }
        catch {
            return { "FirstName": user.FirstName, "Email": user.Email }
        }
    }

    async isSecretKeyExist(query) {
        try {
            let blockData = await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_META_DATA_TABLE_NAME).get(query.Key)
            return (blockData.SecretKey && blockData.SecretKey.length > 0);
        }
        catch {
            return false;
        }
    }
}

export default MyService;