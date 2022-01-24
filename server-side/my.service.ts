import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { DUMMY_SECRET_KEY, BLOCK_META_DATA_TABLE_NAME, BLOCK_CPI_META_DATA_TABLE_NAME, Profile } from '../shared/entities';
import * as encryption from '../shared/encryption-service'
import * as https from "https"

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

    // Block-Settings functions

    async getChatCustomizationList() {
        let profiles: Profile[] = [];
        const dataViews = await this.papiClient.get("/meta_data/data_views?where=Context.Name='UserHomePageChat'");
        for (let dataView of dataViews) {
            let field = dataView.Fields[0];
            if (field) {
                let pageKey = field.FieldID.substring(3)
                let profile = { 'ProfileName': dataView.Context.Profile.Name, 'ProfileID': dataView.Context.Profile.InternalID, 'PageName': dataView.Fields[0]?.Title, 'PageKey': pageKey };
                profiles.push(profile);
            }
        }
        return profiles;
    }

    async upsertChatCustomization(body) {
        if (body) {
            let profile =
            {
                "Type": "Menu",
                "Hidden": body.Hidden,
                "Context": {
                    "Name": "UserHomePageChat",
                    "ScreenSize": "Tablet",
                    "Profile": {
                        "InternalID": body.ProfileID,
                        "Name": body.ProfileName
                    }
                },
                "Fields": [
                    {
                        "FieldID": "PG_" + body.PageKey,
                        "Title": body.PageName
                    }
                ]
            }
            return await this.papiClient.post("/meta_data/data_views", profile);
        }
        else {
            throw new Error(`Profile data is required`);
        }

    }

    async deleteChatCustomization(body) {
        if (body) {
            body.map(obj => {
                obj.Hidden = true;
                this.upsertChatCustomization(obj);
            });
        }
        else {
            throw new Error(`Profile data is required`);
        }
    }

    async updateCPIData(body) {
        if (body) {
            return await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).upsert(body);
        }
    }

    async getCPIData() {
        let onlineEndpointObj = {
            "Enable": false,
            "Token": "",
            "ChatColor": "",
        };
        await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).find().then(data => {
            if (data[0]) {
                onlineEndpointObj = data[0] as any;
            }
        });

        return onlineEndpointObj;
    }

    async isTokenExist() {
        try {
            let data = await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).find();
            return (data[0].Token && data[0].Token.length > 0)
        }
        catch {
            return false;
        }
    }

    async saveToken(body) {
        if (body && body.Token != undefined) {
            let currentToken = {};
            await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).get(body.Key).then(data => {
                if (data.Token) {
                    currentToken = data.Token;
                }
            });

            if (body.Token == DUMMY_SECRET_KEY) {
                if (currentToken && currentToken <= 0) {
                    throw new Error(`Token can't be ${currentToken}`);
                }
            }
            else if (body.Token && body.Token.length > 0) { // real Token
                let enctyptedToken = encryption.encryptSecretKey(body.Token, this.addonSecretKey);
                body.Token = enctyptedToken;
                return this.updateCPIData(body);
            }
            else {
                body.Token = "";
                return this.updateCPIData(body);
            }
        }
        else {
            throw new Error(`Token is required`);
        }
    }

    // CPI endpoints 
    async getStatus(query) {
        const conversation = await this.getConversation(query.Email);
        return {
            "userEmail": query.Email,
            "unreadCount": conversation.total_count,
            "someOtherProperty": "some other value"
        }
    }

    async getContacts(email) {
        if (email) {
            let contactMail = {
                "query": {
                    "field": "email",
                    "operator": "=",
                    "value": email
                }
            }
            return JSON.parse(await this.httpsPost("https://api.intercom.io/contacts/search", contactMail) as any);
        }
        else {
            throw new Error(`Email is required`);
        }
    }

    async getConversation(email) {
        let contacts = await this.getContacts(email);

        if (contacts && contacts.data[0]) {
            let conversationQuery = {
                "query": {
                    "operator": "AND",
                    "value": [
                        {
                            "field": "read",
                            "operator": "=",
                            "value": false
                        },
                        {
                            "field": "contact_ids",
                            "operator": "=",
                            "value": contacts.data[0].id
                        }
                    ]
                }
            }

            let conversations = JSON.parse(await this.httpsPost("https://api.intercom.io/conversations/search", conversationQuery) as any)
            if (conversations) {
                return conversations;
            }
            else {
                throw new Error(`Error in intercom.io/conversations request`);
            }
        }
        throw new Error(`There are no contacts`);
    }

    async testIntercomAPI(query) {
        let conversations = await this.getConversation(query.Email);
        return {
            "conversations": conversations,
            "userEmail": query.Email,
            "unreadCount": conversations.total_count,
            "someOtherProperty": "some other value"
        }
    }

    // https POST request [using https module]
    async httpsPost(url, data) {
        const dataString = JSON.stringify(data)

        let token = "";
        await this.papiClient.addons.data.uuid(this.addonUUID).table(BLOCK_CPI_META_DATA_TABLE_NAME).find().then(data => {
            if (data[0].Token) {
                token = encryption.decryptSecretKey(data[0].Token, this.addonSecretKey);
            }
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Length': dataString.length,
                'Authorization': 'Bearer ' + token

            },
            timeout: 5000, // in ms
        }

        return new Promise((resolve, reject) => {
            const req = https.request(url, options, (res: any) => {
                if (res.statusCode < 200 || res.statusCode > 299) {
                    return reject(new Error(`HTTP status code ${res.statusCode}`))
                }

                const body: any = []
                res.on('data', (chunk) => body.push(chunk))
                res.on('end', () => {
                    const resString = Buffer.concat(body).toString()
                    resolve(resString)
                })
            })

            req.on('error', (err) => {
                reject(err)
            })

            req.on('timeout', () => {
                req.destroy()
                reject(new Error('Request time out'))
            })

            req.write(dataString)
            req.end()
        })

    }
}

export default MyService;