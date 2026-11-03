/**
 * @title AES_GCM.encrypt
 *
 * Chiffrer avec AES-GCM et récupérer le vecteur utilisé.
 */
import { AES_GCM } from "@duplojs/json-web-token";

// 16 octets UTF-8 pour A128GCM, issue d'une source sécurisée
declare const key: string;
const encrypted = await AES_GCM.encrypt("session", key, "A128GCM");
// cipherText et initializationVector sont encodés en Base64URL.
