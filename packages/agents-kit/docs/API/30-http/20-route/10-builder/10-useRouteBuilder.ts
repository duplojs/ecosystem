/**
 * @title useRouteBuilder
 *
 * Déclarer la méthode, les chemins et les options d'une route HTTP.
 */
import { IgnoreByRouteStoreMetadata, controlBodyAsText, useRouteBuilder } from "@duplojs/http";

// Chaque chemin commence par / ; un tableau non vide associe plusieurs chemins
// à la même déclaration. {id} nomme un paramètre dynamique et * un joker.
const builder = useRouteBuilder("GET", ["/users/{id}", "/members/{id}"]);

// Les options, dont les hooks, s'appliquent à cette route.
const configuredBuilder = useRouteBuilder(
	"POST",
	"/events",
	{
		hooks: [
			{
				beforeRouteExecution({ next }) {
					return next();
				},
			},
		],
		bodyController: controlBodyAsText({ bodyMaxSize: "1mb" }),
		metadata: [IgnoreByRouteStoreMetadata()],
	},
);

// Le builder accumule une définition ; handler ajoute la dernière step et crée
// la route. Elle est normalement ajoutée au routeStore global. La metadata
// ci-dessus l'en exclut ; elle peut néanmoins être enregistrée explicitement.
const route = configuredBuilder.handler(
	(__, { response }) => response.noContent("event.received"),
);
// Pour appliquer des process à plusieurs routes, créer un builder avec un
// [preflight](../../50-preflight/10-usePreflightBuilder.ts).
