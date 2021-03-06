import '@pepperi-addons/cpi-node';
import { PapiClient } from '@pepperi-addons/papi-sdk';
import jwt from 'jwt-decode';
import config from "../addon.config.json"

export async function load(configuration: any) {
    let onlineEndpointData = await pepperi.api.adal.getList({
        addon: config.AddonUUID,
        table: 'BlockCPIDataTable'
    });

    const manager = new IntercomCPIManager(onlineEndpointData.objects[0]);
    manager.load();
}

class IntercomCPIManager {
    papiBaseURL = ''
    userEmail = ''

    constructor(private onlineEndpointData) {
        pepperi.auth.getAccessToken().then(accessToken => {
            const parsedToken: any = jwt(accessToken);
            this.papiBaseURL = parsedToken["pepperi.baseurl"]
            this.userEmail = parsedToken["email"];
        });
    }

    async getPapiClient(): Promise<PapiClient> {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: await pepperi.auth.getAccessToken(),
            addonUUID: config.AddonUUID,
            suppressLogging: true
        })
    }

    load() {
        this.subscribe()
    }

    async subscribe() {
        if (this.onlineEndpointData && this.onlineEndpointData.Enable == true) {

            // subscribe to UserHomePageChat
            pepperi.events.intercept("RecalculateUIObject", {
                UIObject: {
                    context: {
                        Name: "UserHomePageChat"
                    }
                }
            },
                async (data) => {
                    let chatColor = "";
                    const papiClient = await this.getPapiClient();
                    const status = await papiClient.addons.api.uuid(config.AddonUUID).file('api').func('get_status').get({ "Email": this.userEmail });
                    if (status.unreadCount > 0) {
                        chatColor = this.onlineEndpointData.ChatColor;
                    }
                    else {
                        chatColor = "";
                    }
                    if (data.UIObject) {
                        data.UIObject.fields[0].textColor = chatColor;
                    }
                });
        }
    }
}