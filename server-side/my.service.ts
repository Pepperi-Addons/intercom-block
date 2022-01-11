import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { DUMMY_SECRET_KEY, BLOCK_CPI_META_DATA_TABLE_NAME } from '../shared/entities';
import * as encryption from '../shared/encryption-service'

const CryptoJS = require("crypto-js");

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
    async handleSecretKey(data: any){
        const currentDataBlock  = await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).find().then(objs => objs[0])
        
        if (data.newSecretKey == DUMMY_SECRET_KEY) {
            if (currentDataBlock.secretKey.length <= 0) {
                throw new Error(`Secret key can't be ${data.newSecretKey}`);              
            }
        }
        else if (data.newSecretKey.length > 0 ) { // real secret key
            let enctyptedSecretKey = encryption.encryptSecretKey(data.newSecretKey, this.addonSecretKey)
            currentDataBlock.secretKey = enctyptedSecretKey;            
            await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).upsert(currentDataBlock);
        }
    }

    async HMAC(key, email){
        return await CryptoJS.HmacSHA256(key, email)
      }

      async getUserHash(query) {
          const data = await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).find().then(objs => objs[0]);
          let secretKey = await encryption.decryptSecretKey(data.secretKey, this.addonSecretKey)
          return await this.HMAC(secretKey, query.Email)
      }
 }

export default MyService;