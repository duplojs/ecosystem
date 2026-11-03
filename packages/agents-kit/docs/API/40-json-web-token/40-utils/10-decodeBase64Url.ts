/**
 * @title decodeBase64Url
 *
 * Décoder du Base64URL en octets.
 */
import { decodeBase64Url, decodeText } from "@duplojs/json-web-token";

// "hello"
const text = decodeText(decodeBase64Url("aGVsbG8"));
