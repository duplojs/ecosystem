/**
 * @title jsonParse
 *
 * Lire du JSON ou renvoyer undefined si la syntaxe est invalide.
 */
import { jsonParse } from "@duplojs/json-web-token";

// objet JSON
const payload = jsonParse("{\"userId\":\"42\"}");
// undefined
const invalid = jsonParse("{");
