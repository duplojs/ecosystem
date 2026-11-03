/**
 * @title RSA.sign
 *
 * Signer avec une clé privée RSA PKCS8.
 */
import { RSA } from "@duplojs/json-web-token";

declare const privateKey: string;
// PEM SPKI correspondant
declare const publicKey: string;
// Base64URL
const signature = await RSA.sign("session", privateKey, "RS256");
// Résultat booléen de la vérification cryptographique.
const isValid = await RSA.verify("session", signature, publicKey, "RS256");
