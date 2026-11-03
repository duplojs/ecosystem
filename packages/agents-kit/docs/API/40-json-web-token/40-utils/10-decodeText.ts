/**
 * @title decodeText
 *
 * Décoder des octets UTF-8.
 */
import { decodeText, encodeText } from "@duplojs/json-web-token";

// "café"
const text = decodeText(encodeText("café"));
