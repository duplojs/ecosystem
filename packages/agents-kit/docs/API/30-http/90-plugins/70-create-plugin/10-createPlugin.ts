/**
 * @title HubPlugin
 *
 * Créer un plugin configurable composé de routes et de hooks.
 */
import { createHookHubLifeCycle, createHookRouteLifeCycle, createHub, useRouteBuilder, type HubPlugin } from "@duplojs/http";

function healthPlugin(params: { path: "/health" | "/ready" }): HubPlugin {
	const health = useRouteBuilder("GET", params.path)
		.handler(
			(__, { response }) => response.ok("service.healthy", { healthy: true }),
		);

	return {
		name: "health",
		routes: [health],
		hooksHubLifeCycle: [
			createHookHubLifeCycle({
				beforeServerBuildRoutes(hub) {
					hub.setNotfoundHandler(
						({ response }) => response.notFound("route.missing"),
					);
				},
			}),
		],
		hooksRouteLifeCycle: [
			createHookRouteLifeCycle({
				beforeSendResponse({ currentResponse, next }) {
					currentResponse.setHeader("x-service", "users");
					return next();
				},
			}),
		],
	};
}

const hub = createHub({ environment: "DEV" })
	.plug(
		healthPlugin({ path: "/health" }),
	);

// plug accepte aussi une factory recevant le Hub courant. Les hooks de route
// fournis par le plugin s'appliquent globalement ; les hooks du Hub participent
// à son cycle de vie. Le contrat permet aussi des extensions avancées des
// builders et lecteurs de body.
