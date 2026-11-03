/**
 * @title RSA.verify
 *
 * Vérifier une signature RSA avec une clé publique SPKI.
 */
import { RSA } from "@duplojs/json-web-token";

// PEM PKCS8 correspondant
declare const privateKey: string;
declare const publicKey: string;
const signature = await RSA.sign("session", privateKey, "RS512");
// Résultat booléen de la vérification cryptographique.
const isValid = await RSA.verify("session", signature, publicKey, "RS512");
