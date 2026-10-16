/**
 * @title Générer les contrats et les schémas d'un SDK.
 *
 * Déclencher le cycle du Hub en BUILD pour générer sans écoute HTTP.
 */
import "./user-route";
import "./rename-user-route";
import "./protected-route";
import { createHub, routeStore } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import * as DPath from "@duplojs/lang/path";

// Les dossiers parents de sortie sont préparés par le projet.
const hub = createHub({ environment: "BUILD" })
	.register(routeStore.getAll())
	.plug(codeGeneratorPlugin({
		outputFile: DPath.declarePath("sdk/routes.d.ts"),
		generateStructure: {
			// Ce dossier contient exclusivement les sources générées.
			outputFolder: DPath.declarePath("sdk/dataStructures"),
		},
	}));

await createHttpServer(hub, {
	host: "localhost",
	port: 1506,
});
