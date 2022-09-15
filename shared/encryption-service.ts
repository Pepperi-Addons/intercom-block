import Cryptr from 'cryptr'
import * as CryptoJS from 'crypto-js';

export function encryptSecretKey(secretKey: string, key: string) {
    const cryptr = new Cryptr(key);
    const encryptedSecretKey = cryptr.encrypt(secretKey);
    return encryptedSecretKey;

}
export function decryptSecretKey(encryptedString: string, key: string) {
    const cryptr = new Cryptr(key);
    const decryptedSecretKey= cryptr.decrypt(encryptedString);
    return decryptedSecretKey;
}

export async function HMAC(key, email){
    return await CryptoJS.HmacSHA256(email, key).toString(CryptoJS.enc.Hex);
  }
