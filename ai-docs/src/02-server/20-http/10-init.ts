/**
 * @title Créer une application HTTP
 *
 * Une application HTTP est organisée autour d'un `Hub`.
 *
 * Le `Hub` centralise la configuration, les routes et les plugins.
 * Ces éléments sont indépendants de la plateforme d'exécution.
 *
 * Certaines fonctionnalités peuvent toutefois nécessiter un environnement
 * serveur, notamment lorsqu'elles accèdent au système de fichiers.
 */
import { createHub, routeStore } from "@duplojs/http";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import * as DCommon from "@duplojs/lang/common";

export const hub = createHub({ environment: "DEV" })
	// `plug` permet de charger des plugins dans le `Hub`.
	.plug(
		// `codeGeneratorPlugin` génère le typage des entrées et sorties
		// des routes de l'application.
		codeGeneratorPlugin({
			outputFile: DCommon.infer("types.d.ts"),
		}),
	)
	// Toutes les routes créées sont automatiquement ajoutées au `routeStore`.
	// Les modules qui déclarent ces routes doivent toutefois avoir été chargés
	// avant l'enregistrement du store dans le `Hub`.
	.register(
		routeStore.getAll(),
	);

// Une fois le `Hub` configuré, il peut être démarré à l'aide
// du connecteur correspondant à la plateforme d'exécution.
// Exemple avec Node.js :
import { createHttpServer } from "@duplojs/http/node";

await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);
