/**
 * @title Créer une application HTTP
 *
 * Configuration d'un `Hub` et enregistrement des routes d'une application HTTP.
 */
import { createHub, routeStore } from "@duplojs/http";

export const hub = createHub({ environment: "DEV" })
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
