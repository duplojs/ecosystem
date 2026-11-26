/**
 * @title createHttpClient
 *
 * Créer un client HTTP avec ou sans contrat et configurer son protocole.
 */
import { createHttpClient } from "@duplojs/http/client";

// Sans contrat, chemins, paramètres et réponses ne bénéficient pas du typage
// spécifique à une API. Le contenu d'une réponse est notamment unknown.
const external = createHttpClient({
	baseUrl: "https://example.com",
	disabledPredictedMode: true,
});

const externalRequest = external.get("/health");

// Un contrat peut être écrit à la main ou déduit d'une route DuploJS avec
// RouteDeclarationToContract. On peut aussi [générer les types des routes](../../90-plugins/10-code-generator/index.md)
// pour les partager avec le client sans lui fournir le code du serveur.
interface Routes {
	method: "GET";
	path: "/users/{id}";
	params: { id: number };
	responses: {
		code: "200";
		information: "user.found";
		body: { name: string };
	};
}

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
	credentials: "include",
	informationHeaderKey: "information",
	predictedHeaderKey: "predicted",
});

const request = client.get(
	"/users/{id}",
	{
		params: {
			id: 1,
		},
	},
);

// baseUrl est ajoutée au début du chemin. credentials et cache définissent les
// valeurs par défaut de RequestInit ; initParams peut les remplacer par requête.
// hooks initialise les hooks globaux.
// informationHeaderKey et predictedHeaderKey nomment les headers lus ; leurs
// valeurs par défaut sont respectivement "information" et "predicted".
// disabledPredictedMode désactive l'exigence du marqueur pour les sélections.
// clientCacheInitialValues initialise le cache applicatif en mémoire. Le contrat
// ne valide pas le body reçu à l'exécution.
