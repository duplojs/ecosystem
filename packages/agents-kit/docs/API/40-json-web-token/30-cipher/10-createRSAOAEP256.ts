/**
 * @title Cipher.createRSAOAEP256
 *
 * Configurer RSA-OAEP avec SHA-256.
 */
import { Cipher } from "@duplojs/json-web-token";
import type * as DCommon from "@duplojs/lang/common";

// PEM PKCS8
declare const privateKey: string;
// PEM SPKI
declare const publicKey: string;

const cipher = Cipher.createRSAOAEP256({
	privateKey,
	publicKey,
});

type _Algorithm = DCommon.ExpectType<
	typeof cipher.algorithm,
	"RSA-OAEP-256",
	"strict"
>;

// La factory peut être passée au handler pour fournir les clés par opération.
const factory = Cipher.createRSAOAEP256;
