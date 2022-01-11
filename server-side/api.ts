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

export async function get_user_hash(client: Client, request: Request)  {
    const service = new MyService(client)

    if (request.method === 'GET') {
        return service.getUserHash(request.query)
    }
    else {
        throw new Error(`Method ${request.method} not supported`);
    }
}

