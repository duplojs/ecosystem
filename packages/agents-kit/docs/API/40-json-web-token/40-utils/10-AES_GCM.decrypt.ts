/**
 * @title AES_GCM.decrypt
 *
 * Déchiffrer avec AES-GCM et le vecteur associé.
 */
import { AES_GCM } from "@duplojs/json-web-token";

// 16 octets UTF-8 pour A128GCM
declare const key: string;
const encrypted = await AES_GCM.encrypt("session", key, "A128GCM");
const content = await AES_GCM.decrypt(
	encrypted.cipherText,
	key,
	encrypted.initializationVector,
	"A128GCM",
);
// Le contenu déchiffré est "session" si la clé et le vecteur correspondent.
