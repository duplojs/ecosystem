/**
 * @title RSA_OAEP.encrypt
 *
 * Chiffrer avec une clé publique RSA-OAEP SPKI.
 */
import { RSA_OAEP } from "@duplojs/json-web-token";

declare const publicKey: string;
// Base64URL
const encrypted = await RSA_OAEP.encrypt("session", publicKey, "RSA-OAEP-256");
