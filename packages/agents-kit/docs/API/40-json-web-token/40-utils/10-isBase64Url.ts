/**
 * @title isBase64Url
 *
 * Vérifier la forme d’une chaîne Base64URL.
 */
import { isBase64Url } from "@duplojs/json-web-token";

// true
const valid = isBase64Url("aGVsbG8");
// false
const invalid = isBase64Url("a+");
