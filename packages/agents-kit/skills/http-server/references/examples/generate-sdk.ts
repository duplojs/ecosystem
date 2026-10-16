/**
 * @title Générer les contrats et les schémas d'un SDK.
 *
 * Déclencher le cycle du Hub en BUILD pour générer sans écoute HTTP.
 */
import "@duplojs/tools/toTypescript";
import "./user-route";
import "./rename-user-route";
import { createHub, routeStore } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import * as DPath from "@duplojs/lang/path";
import { renameUserBody, userStructure } from "./contracts";

// Les dossiers parents de sortie sont préparés par le projet.
const hub = createHub({ environment: "BUILD" })
	.register(routeStore.getAll())
	.plug(codeGeneratorPlugin({
		outputFile: DPath.declarePath("sdk/routes.d.ts"),
		generateStructure: {
			// Ce dossier contient exclusivement les sources générées.
			outputFolder: DPath.declarePath("sdk/dataStructures"),
			// L'extension est chargée dans ce module, avant ces appels.
			// Les copies nommées ne modifient pas les schémas des routes.
			structures: [
				userStructure.addIdentifier("User"),
				renameUserBody.addIdentifier("RenameUserBody"),
			],
			disabledFromRoute: true,
		},
	}));

await createHttpServer(hub, {
	host: "localhost",
	port: 1506,
});
