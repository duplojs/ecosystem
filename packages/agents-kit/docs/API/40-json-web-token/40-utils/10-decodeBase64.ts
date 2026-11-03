/**
 * @title decodeBase64
 *
 * Décoder du Base64 en octets.
 */
import { decodeBase64, decodeText } from "@duplojs/json-web-token";

// "hello"
const text = decodeText(decodeBase64("aGVsbG8="));
