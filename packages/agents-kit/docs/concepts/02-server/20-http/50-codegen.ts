/**
 * @title Comment partager des ressources
 *
 * Génération du typage des routes et des `DataStructure` pour partager un contrat statique.
 */
import { createHub, routeStore } from "@duplojs/http";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import * as DCommon from "@duplojs/lang/common";

const hub = createHub({ environment: "BUILD" })
	.register(routeStore.getAll())
	.plug(
		codeGeneratorPlugin({
			// Génère le typage des routes.
			outputFile: DCommon.infer("types.d.ts"),

			// Génère les `DataStructure` utilisées par les routes.
			generateStructure: {
				outputFolder: DCommon.infer("dataStructures"),
			},
		}),
	);

// La génération produit des fichiers autonomes à distribuer aux consommateurs.
// Les `DataStructure` peuvent être générées depuis les routes ou sélectionnées explicitement.

// `codeGeneratorPlugin` exécute sa génération sur le hook `beforeStartServer`.
// Le `Hub` doit donc disposer d'un connecteur HTTP.
// En environnement `BUILD`, le cycle s'exécute sans démarrer le serveur HTTP.
