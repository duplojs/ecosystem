/**
 * @title Initialiser un client HTTP
 *
 * Configuration d'un client HTTP typé et des paramètres communs aux requêtes.
 */
import { createHttpClient } from "@duplojs/http/client";
import { type RouteDeclarationToContract } from "@duplojs/http";
import * as DCommon from "@duplojs/lang/common";
import { type usersRoute } from "../../02-server/20-http/20-route";

// L'import de type ne charge pas les déclarations de routes au runtime.
// Les réponses incluent les retours du handler et les refus des étapes.
export type Routes = RouteDeclarationToContract<typeof usersRoute>;

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
		"/users",
		{
			query: {
				page: DCommon.cast(1),
				quantityPerPage: DCommon.cast(5),
			},
		},
	)
	.iWantInformationOrThrow("users.findMany");

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
