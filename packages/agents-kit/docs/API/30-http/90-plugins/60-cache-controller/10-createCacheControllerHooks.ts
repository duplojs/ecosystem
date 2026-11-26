/**
 * @title createCacheControllerHooks
 *
 * Ajouter le header Cache-Control aux réponses HTTP.
 */
import { useRouteBuilder } from "@duplojs/http";
import { createCacheControllerHooks } from "@duplojs/http/cacheController";

const route = useRouteBuilder("GET", "/catalog", {
	hooks: [
		createCacheControllerHooks({
			public: true,
			maxAge: 300,
			staleWhileRevalidate: 60,
		}),
	],
})
	.handler(
		(__, { response }) => response.ok("catalog.found", { items: [] }),
	);

// Le hook beforeSendResponse ajoute Cache-Control seulement aux réponses 2xx et
// 3xx dépourvues de ce header. Sans paramètres, il n'ajoute rien. Un header déjà
// présent reste prioritaire. Les directives comprennent aussi private, noCache,
// noStore, sMaxAge, immutable et extensions. Un hook peut être installé sur une
// route ou globalement avec Hub.addRouteHooks.
