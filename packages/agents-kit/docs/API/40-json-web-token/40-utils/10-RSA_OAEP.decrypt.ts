/**
 * @title RSA_OAEP.decrypt
 *
 * Déchiffrer avec une clé privée RSA-OAEP PKCS8.
 */
import { RSA_OAEP } from "@duplojs/json-web-token";

declare const privateKey: string;
// PEM SPKI correspondant
declare const publicKey: string;
const encrypted = await RSA_OAEP.encrypt("session", publicKey, "RSA-OAEP-256");
// Le contenu déchiffré est "session" si les clés correspondent.
const content = await RSA_OAEP.decrypt(encrypted, privateKey, "RSA-OAEP-256");
