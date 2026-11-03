/**
 * @title Signer.factory
 *
 * Définir une factory de signature et de vérification.
 */
import { HMAC, Signer } from "@duplojs/json-web-token";
import type * as DCommon from "@duplojs/lang/common";

const createSigner = Signer.factory(
	"HS256",
	(params: { secret: string }, algorithm) => ({
		sign: (content) => HMAC.sign(content, params.secret, algorithm),
		verify: (content, signature) => HMAC.verify(content, signature, params.secret, algorithm),
	}),
);

declare const secret: string;
const signer = createSigner({
	secret,
});
const signature = await signer.sign("session-content");
// Résultat booléen de la vérification cryptographique.
const isValid = await signer.verify("session-content", signature);

type _Algorithm = DCommon.ExpectType<
	typeof signer.algorithm,
	"HS256",
	"strict"
>;
