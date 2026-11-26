/**
 * @title Hub.plug
 *
 * Installer un plugin et intégrer les capacités qu'il apporte au Hub.
 */
import { createHub } from "@duplojs/http";
import { openApiGeneratorPlugin } from "@duplojs/http/openApiGenerator";

const hub = createHub({ environment: "DEV" })
	.plug(openApiGeneratorPlugin({ routePath: "/swagger" }));

const configuredHub = createHub({ environment: "DEV" })
	.plug((currentHub) => openApiGeneratorPlugin({
		routePath: currentHub.config.environment === "DEV" ? "/docs" : "/api-docs",
	}));

// plug accepte un HubPlugin ou une fonction qui reçoit le Hub et retourne un
// plugin. Cette fonction est appelée immédiatement. Les routes, hooks et autres
// éléments du plugin sont ajoutés au Hub. Installer le plugin avant le démarrage.
// plug retourne le même Hub.
