/**
 * @title corsPlugin
 *
 * Configurer les headers CORS et les réponses aux requêtes OPTIONS.
 */
import { createHub, useRouteBuilder } from "@duplojs/http";
import { corsPlugin, IgnoreRouteCorsMetadata } from "@duplojs/http/cors";

const hub = createHub({ environment: "DEV" })
	.plug(
		corsPlugin({
			allowOrigin: ["https://app.example.com"],
			allowHeaders: ["content-type", "authorization"],
			allowMethods: true,
			credentials: true,
			exposeHeaders: ["information"],
			maxAge: 600,
		}),
	);

const privateRoute = useRouteBuilder("GET", "/internal", {
	metadata: [IgnoreRouteCorsMetadata()],
})
	.handler(
		(__, { response }) => response.noContent("internal"),
	);

hub.register(privateRoute);

// allowOrigin accepte chaîne, RegExp, tableau, true ou callback éventuellement
// asynchrone. Le hook actuel n’attend toutefois pas la promesse de ce callback :
// utiliser une décision synchrone pour garantir le header avant l’envoi.
// allowHeaders accepte chaîne, tableau ou true ; allowMethods accepte
// une méthode, un tableau ou true. Avec true, les méthodes sont calculées par
// chemin depuis les routes enregistrées, hors routes ignorées. exposeHeaders,
// credentials et maxAge configurent les headers correspondants ; au moins une
// option est requise. Le plugin enregistre OPTIONS /* et répond 204 / cors.
// Cette route applique allowMethods, allowHeaders et maxAge ; le hook qui ajoute
// allowOrigin, credentials et exposeHeaders exclut les routes OPTIONS.
// IgnoreRouteCorsMetadata exclut une route des hooks CORS et du calcul des
// méthodes. Une route OPTIONS personnelle reste responsable de son traitement.
