/**
 * @title HMAC.sign
 *
 * Signer avec HMAC.
 */
import { HMAC } from "@duplojs/json-web-token";

// secret fourni par une source sécurisée
declare const secret: string;
// Base64URL
const signature = await HMAC.sign("session", secret, "HS256");
// Résultat booléen de la vérification cryptographique.
const isValid = await HMAC.verify("session", signature, secret, "HS256");
