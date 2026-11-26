/**
 * @title Hub.setMalformedUrlHandler
 *
 * Personnaliser la réponse lorsque l'URL de la requête est malformée.
 */
import { createHub } from "@duplojs/http";

// La callback reçoit request et response et retourne une réponse prévue,
// directement ou par promesse. Par défaut : 400 / malformed-url, sans body.
const hub = createHub({ environment: "DEV" })
	.setMalformedUrlHandler(({ response }) => response.badRequest("url.invalid"));
