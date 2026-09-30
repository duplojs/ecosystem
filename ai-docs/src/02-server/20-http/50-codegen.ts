/**
 * @title Comment partager des ressources
 *
 * `codeGeneratorPlugin` génère à partir des routes les ressources nécessaires
 * pour les utiliser depuis un autre service.
 *
 * Il permet notamment de partager le typage des routes et leurs `DataStructure`
 * sans partager la codebase qui les implémente.
 *
 * La génération constitue ainsi un contrat statique entre plusieurs services
 * ou applications, qui peut ensuite servir à construire un client typé.
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

// La génération ne repose pas sur l'inférence entre deux codebases.
// Elle produit des fichiers autonomes qui peuvent être distribués
// uniquement aux projets qui consomment ces routes.
//
// Le plugin peut également générer des dataStructures.
// `generateStructure.disabledFromRoute` permet de désactiver leur génération
// depuis les routes, tandis que `generateStructure.structures` permet
// de sélectionner explicitement ceux qui doivent être générés.

// `codeGeneratorPlugin` exécute sa génération sur le hook `beforeStartServer`.
// Le `Hub` doit donc disposer d'un connecteur HTTP.
//
// Pour une génération seule, utilisez un `Hub` en environnement `BUILD`
// afin d'exécuter le cycle de build sans démarrer le serveur HTTP.
