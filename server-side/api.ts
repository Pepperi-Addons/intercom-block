import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'

export async function secret_key(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'POST') {
        return service.handleSecretKey(request.body)
    }
    if (request.method === 'GET') {
        return service.isSecretKeyExist(request.query)
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

// Block-Setting functions
export async function chat_customization(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'GET') {
        return service.getChatCustomizationList()
    }
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

export async function cpi_table_data(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'POST') {
        return service.updateCPIData(request.body)
    }
    else if (request.method === 'GET'){
        return service.getCPIData()
    }
    else {
        throw new Error(`Method ${request.method} not supported`); 
    }
}

export async function save_Token(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'POST') {
        return service.saveToken(request.body)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}

// CPI endpoints 

export async function get_status(client: Client, request: Request) {
    const service = new MyService(client)

    if (request.method === 'GET') {
        return service.getStatus(request.query)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}