/**
 * @title encodeBase64
 *
 * Encoder des octets en Base64.
 */
import { encodeBase64, encodeText } from "@duplojs/json-web-token";

// "aGVsbG8="
const encoded = encodeBase64(encodeText("hello"));
