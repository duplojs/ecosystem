/**
 * @title Créer une application HTTP
 *
 * Configuration d'un `Hub`, plugins et enregistrement des routes d'une application HTTP.
 */
import { createHub, routeStore } from "@duplojs/http";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import * as DCommon from "@duplojs/lang/common";

export const hub = createHub({ environment: "DEV" })
	.plug(
		// Les plugins ajoutent des capacités au `Hub`.
		codeGeneratorPlugin({
			outputFile: DCommon.infer("types.d.ts"),
		}),
	)
	// Les modules de routes doivent être chargés avant l'enregistrement du store.
	.register(
		routeStore.getAll(),
	);

// Le connecteur démarre le `Hub` sur la plateforme ciblée.
import { createHttpServer } from "@duplojs/http/node";

await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);
