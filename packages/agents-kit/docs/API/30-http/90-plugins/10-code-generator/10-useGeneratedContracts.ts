/**
 * @title Consommer les contrats générés
 *
 * Utiliser les types de routes générés pour créer un client HTTP.
 */
import { createHttpClient } from "@duplojs/http/client";

// Copie du routes.d.ts réellement généré par l'intégration CodeGenerator.
// Dans une application cliente, importer Routes depuis le package partagé.
import type { Routes } from "./fixtures/routes";

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
});

const request = client.get(
	"/users/{userId}",
	{
		params: {
			userId: 1,
		},
	},
);

const result = request.iWantInformation("users.find");

// Publier routesTypes.generate/routes.d.ts et slices.generate avec leurs
// dépendances, puis importer Routes dans le client. TypeScript vérifie ainsi les
// appels et les réponses attendues, mais ne valide pas le body reçu à l'exécution.
// Les slices fournissent les exports nécessaires à l'exécution, par exemple des
// DataStructures. Exécuter les deux commandes Rolldown avant le build du client
// et exposer les fichiers générés dans le package partagé. Il n'est pas nécessaire
// d'envoyer tout le code du serveur au client.
