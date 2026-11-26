/**
 * @title Hub.setNotfoundHandler
 *
 * Personnaliser la réponse lorsqu'aucune route ne correspond à la requête.
 */
import { createHub } from "@duplojs/http";

// La callback reçoit request et response et retourne une réponse HTTP prévue,
// directement ou par promesse. Par défaut : 404 / notfound-route, avec
// « méthode:chemin » dans le body.
const hub = createHub({ environment: "DEV" })
	.setNotfoundHandler(({ request, response }) => response.notFound(
		"route.absent",
		request.path,
	));
