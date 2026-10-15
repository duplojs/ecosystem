/**
 * @title Initialiser un client HTTP
 *
 * Création d'un client à partir du contrat statique des routes, configuration
 * globale et conservation du typage des requêtes et réponses exposées par le
 * serveur.
 */
import { createHttpClient } from "@duplojs/http/client";

// Exemple réduit du contrat produit par `codeGeneratorPlugin`.
export interface Routes {
	method: "GET";
	path: "/hello-world";
	query: {
		name: string;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "helloWorld.send";
		body: string;
	};
}

// `baseUrl` suffit pour créer un client.
// Les autres options configurent le comportement global.
export const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

declare function getAuthToken(): string | undefined;

// Un header par défaut peut être fixe ou recalculé à chaque requête.
client.addDefaultHeader(
	"authorization",
	() => getAuthToken(),
);

// Le contrat limite les paths, paramètres et réponses disponibles.
const response = await client
	.get(
		"/hello-world",
		{
			query: {
				name: "William",
			},
		},
	)
	.iWantInformationOrThrow("helloWorld.send");

void response.body;
void response.code;
void response.information;
void response.headers;
void response.raw;

// `information` est lue depuis le header `information`, sauf configuration.
createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
	informationHeaderKey: "x-information",
});
