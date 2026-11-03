/**
 * @title pemToBinary
 *
 * Convertir une clé PEM en octets DER.
 */
import { pemToBinary } from "@duplojs/json-web-token";

// clé PEM SPKI
declare const publicKey: string;
// octets DER
const der = pemToBinary(publicKey);
