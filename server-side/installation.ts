
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { Relation } from '@pepperi-addons/papi-sdk'
import MyService from './my.service';
import { BlockDataScheme, BlockCPIDataScheme } from './metadata';

const filename = 'chat';

export async function install(client: Client, request: Request): Promise<any> {
    // For page block template uncomment this.
    const relationsRes = await createPageBlockRelation(client);
    const settingRes = await createSettingsRelation(client);
    const adalRes = await createADALSchemes(client)
    
    return {
        success: adalRes.success && relationsRes.success && settingRes.success,
        errorMessage: `adalRes: ${adalRes.errorMessage}, relationsRes:  ${relationsRes.errorMessage}, settingsRes:  ${settingRes.errorMessage}`
    };
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

async function createPageBlockRelation(client: Client): Promise<any> {
    try {
        const blockName = 'Intercom Chat';

        // TODO: Change to fileName that declared in webpack.config.js

        const pageComponentRelation: Relation = {
            RelationName: "PageBlock",
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `BlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `BlockModule`, // This is should be the block module name (from the client-side)
            EditorComponentName: `BlockEditorComponent`, // This is should be the block editor component name (from the client-side)
            EditorModuleName: `BlockEditorModule`, // This is should be the block editor module name (from the client-side)
            ElementsModule: 'WebComponents',
            ElementName: `intercom-element-${client.AddonUUID}`,
            EditorElementName: `intercom-editor-element-${client.AddonUUID}`,
        };

        const service = new MyService(client);
        const result = await service.upsertRelation(pageComponentRelation);
        return { success:true, resultObject: result };
    } catch(err) {
        return { success: false, resultObject: err , errorMessage: `Error in upsert relation. error - ${err}`};
    }
}

async function createSettingsRelation(client: Client): Promise<any> {
    try {
        const blockName = 'Intercom Chat';

        // TODO: Change to fileName that declared in webpack.config.js

        const pageComponentRelation: Relation = {
            RelationName: "SettingsBlock",
            GroupName: "Block Settings",
            SlugName: "block_settings",
            Name: blockName,
            Description: "Settings",
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `BlockSettingsComponent`,
            ModuleName: `BlockSettingsModule`,
            ElementsModule: 'WebComponents',
            ElementName: `settings-element-${client.AddonUUID}`,
        };

        const service = new MyService(client);
        const result = await service.upsertRelation(pageComponentRelation);
        return { success:true, resultObject: result };
    } catch(err) {
        return { success: false, resultObject: err , errorMessage: `Error in upsert relation. error - ${err}`};
    }
}

async function createADALSchemes(client: Client) {
    try {
        const service = new MyService(client);
        await service.crateADALTable(BlockDataScheme);
        await service.crateADALTable(BlockCPIDataScheme);
        return {
            success: true,
            errorMessage: ""
        }
    }
    catch (err) {
        return {
            success: false,
            errorMessage: (err instanceof TypeError && 'message' in err) ? err.message : 'Unknown Error Occured',
        }
    }
}