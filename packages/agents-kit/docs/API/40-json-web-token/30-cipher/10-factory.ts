/**
 * @title Cipher.factory
 *
 * Définir une factory de chiffrement et de déchiffrement.
 */
import { Cipher, RSA_OAEP } from "@duplojs/json-web-token";

const createCipher = Cipher.factory(
	"RSA-OAEP-256",
	(params: {
		privateKey: string;
		publicKey: string;
	}, algorithm) => ({
		encrypt: (content) => RSA_OAEP.encrypt(content, params.publicKey, algorithm),
		decrypt: (content) => RSA_OAEP.decrypt(content, params.privateKey, algorithm),
	}),
);

// PEM PKCS8
declare const privateKey: string;
// PEM SPKI
declare const publicKey: string;
const cipher = createCipher({
	privateKey,
	publicKey,
});
const encrypted = await cipher.encrypt("session");
// Le contenu déchiffré est "session" si les clés correspondent.
const decrypted = await cipher.decrypt(encrypted);
