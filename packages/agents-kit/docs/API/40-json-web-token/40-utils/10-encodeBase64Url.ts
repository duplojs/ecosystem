/**
 * @title encodeBase64Url
 *
 * Encoder du texte ou des octets en Base64URL sans remplissage.
 */
import { encodeBase64Url } from "@duplojs/json-web-token";

// "aGVsbG8"
const encoded = encodeBase64Url("hello");
