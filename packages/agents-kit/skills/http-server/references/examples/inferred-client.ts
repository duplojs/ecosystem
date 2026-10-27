/**
 * @title Partager les types d'une route avec un client HTTP.
 *
 * Créer un client dont les requêtes et les réponses suivent la définition des routes serveur.
 */
import { type RouteDeclarationToContract } from "@duplojs/http";
import { createHttpClient } from "@duplojs/http/client";
import type * as DCommon from "@duplojs/lang/common";
import { type renameUserRoute } from "./rename-user-route";
import { type RenameUserBody, type User } from "./contracts";

// Ces imports de type n'exécutent pas les modules du serveur.
type Routes = RouteDeclarationToContract<typeof renameUserRoute>;

type _CheckResponses = DCommon.ExpectType<
	Routes["responses"],
	| {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body: Error;
	}
	| {
		readonly code: "404";
		readonly information: "user.notFound";
		readonly body: undefined;
	}
	| {
		readonly code: "409";
		readonly information: "user.renameDenied";
		readonly body: undefined;
	}
	| {
		readonly code: "200";
		readonly information: "user.renamed";
		readonly body: User;
	},
	"strict"
>;

const client = createHttpClient<Routes>({
	baseUrl: "https://duplo-api.example.com",
});

export function renameUserRemotely(userId: User["id"], body: RenameUserBody) {
	return client.patch("/users/{userId}", {
		params: { userId },
		body,
	}).toEitherByInformation({
		"extract-error": false,
		"user.notFound": false,
		"user.renameDenied": false,
		"user.renamed": true,
	});
}
