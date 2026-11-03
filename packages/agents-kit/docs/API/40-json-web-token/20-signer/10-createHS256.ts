/**
 * @title Signer.createHS256
 *
 * Configurer HMAC avec SHA-256.
 */
import { Signer } from "@duplojs/json-web-token";
import type * as DCommon from "@duplojs/lang/common";

// Les clés proviennent d'une source sécurisée.
declare const secret: string;

const signer = Signer.createHS256({
	secret,
});

type _Algorithm = DCommon.ExpectType<
	typeof signer.algorithm,
	"HS256",
	"strict"
>;

// La factory elle-même peut aussi être fournie au handler pour choisir
// les paramètres à chaque opération.
const factory = Signer.createHS256;
