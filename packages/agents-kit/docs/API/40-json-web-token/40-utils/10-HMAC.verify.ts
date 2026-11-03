/**
 * @title HMAC.verify
 *
 * Vérifier une signature HMAC.
 */
import { HMAC } from "@duplojs/json-web-token";

declare const secret: string;
const signature = await HMAC.sign("session", secret, "HS512");
// Résultat booléen de la vérification cryptographique.
const isValid = await HMAC.verify("session", signature, secret, "HS512");
