/**
 * @title Initialiser un client HTTP
 *
 * Un client HTTP se construit à partir du typage des routes exposées par
 * l'interface HTTP DuploJS.
 *
 * Ce typage est généralement produit par `codeGeneratorPlugin`.
 * Le client n'a pas besoin de partager la codebase du serveur :
 * il consomme uniquement le contrat statique généré.
 *
 * Ce contrat décrit les méthodes, paths, entrées attendues et réponses
 * possibles. Il sert ensuite à écrire les requêtes et à traiter leurs
 * réponses sans redécrire le contrat côté client.
 */
import { createHttpClient } from "@duplojs/http/client";

// Exemple réduit d'un fichier de routes généré.
// Dans une application réelle, ce type est importé depuis le fichier produit
// par `codeGeneratorPlugin`.
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

// `baseUrl` est la seule configuration obligatoire.
// Les autres options fixent le comportement global du client :
// credentials, cache, hooks, clés de headers utilisées pour lire
// l'information de réponse ou mode de prédiction.
export const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

declare function getAuthToken(): string | undefined;

// Les headers communs au client peuvent être ajoutés après l'initialisation.
// La valeur est un `MayBeGetter` : elle peut être fixe ou recalculée à
// chaque requête.
client.addDefaultHeader(
	"authorization",
	() => getAuthToken(),
);

// Le typage des routes guide ensuite les requêtes disponibles.
// Ici, `/hello-world` exige une query `name` et produit uniquement
// les réponses déclarées dans `Routes`.
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

// La réponse contient le body typé et les données transportées
// par la réponse HTTP réelle.
void response.body;
void response.code;
void response.information;
void response.headers;
void response.raw;

// `information` est la clé discriminante centrale dans les réponses DuploJS.
// Par défaut, le client la lit depuis le header `information`.
// Si un backend utilise une autre clé, elle doit être configurée dès
// l'initialisation du client.
createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
	informationHeaderKey: "x-information",
});
