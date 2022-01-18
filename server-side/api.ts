import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'

// add functions here
// this function will run on the 'api/foo' endpoint
// the real function is runnning on another typescript file
export async function foo(client: Client, request: Request) {
    const service = new MyService(client)
    const res = await service.getAddons()
    return res
};

export async function save_secret_key(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'POST') {
        return service.handleSecretKey(request.body)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}

export async function get_user_data(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'GET') {
        return service.getUserData(request.query)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}
export async function is_secret_key_exist(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'GET') {
        return service.isSecretKeyExist(request.query)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}

// Block-Setting functions
export async function get_chat_customization_list(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'GET') {
        return service.getChatCustomizationList()
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}

export async function upsert_chat_customization(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'POST') {
        return service.upsertChatCustomization(request.body)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}

export async function delete_chat_customization(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'POST') {
        return service.deleteChatCustomization(request.body)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}

export async function update_cpi_table(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'POST') {
        return service.updateCPIData(request.body)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}