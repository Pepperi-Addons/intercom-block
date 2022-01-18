
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

export async function install(client: Client, request: Request): Promise<any> {
    // For page block template uncomment this.
    const relationsRes = await createPageBlockRelation(client);
    const adalRes = await createADALSchemes(client)
    
    return {
        success: adalRes.success && relationsRes.success,
        errorMessage: `adalRes: ${adalRes.errorMessage}, relationsRes:  ${relationsRes.errorMessage}`
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
        // TODO: change to block name (this is the unique relation name and the description that will be on the page builder editor in Blocks section).
        const blockName = 'SukandaChat';

        // TODO: Change to fileName that declared in webpack.config.js
        const filename = 'chat';

        const pageComponentRelation: Relation = {
            RelationName: "PageBlock",
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG11",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `BlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `BlockModule`, // This is should be the block module name (from the client-side)
            EditorComponentName: `BlockEditorComponent`, // This is should be the block editor component name (from the client-side)
            EditorModuleName: `BlockEditorModule` // This is should be the block editor module name (from the client-side)
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