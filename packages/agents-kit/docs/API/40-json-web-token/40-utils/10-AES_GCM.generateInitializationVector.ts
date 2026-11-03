/**
 * @title AES_GCM.generateInitializationVector
 *
 * Produire un vecteur aléatoire de 12 octets.
 */
import { AES_GCM } from "@duplojs/json-web-token";

// 12 octets aléatoires
const iv = AES_GCM.generateInitializationVector();
