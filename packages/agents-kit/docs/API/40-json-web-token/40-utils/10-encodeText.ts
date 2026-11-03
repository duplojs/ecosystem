/**
 * @title encodeText
 *
 * Encoder une chaîne en UTF-8.
 */
import { encodeText } from "@duplojs/json-web-token";

// octets UTF-8
const bytes = encodeText("café");
