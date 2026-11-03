/**
 * @title Signer.createRS256
 *
 * Configurer RSA avec SHA-256.
 */
import { Signer } from "@duplojs/json-web-token";
import type * as DCommon from "@duplojs/lang/common";

// Les clés proviennent d'une source sécurisée.
// PEM PKCS8
declare const privateKey: string;
// PEM SPKI
declare const publicKey: string;

const signer = Signer.createRS256({
	privateKey,
	publicKey,
});

type _Algorithm = DCommon.ExpectType<
	typeof signer.algorithm,
	"RS256",
	"strict"
>;

// La factory elle-même peut aussi être fournie au handler pour choisir
// les paramètres à chaque opération.
const factory = Signer.createRS256;
