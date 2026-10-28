/**
 * @title Effectuer une requête HTTP
 *
 * Envoi de données et traitement des réponses typées d’une API HTTP.
 */
import { createHttpClient } from "@duplojs/http/client";
import type * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export type Routes = {
	readonly method: "POST";
	readonly path: "/users";
	readonly body: {
		readonly username: string;
		readonly age: number;
	};
	readonly responses: {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body: Error;
	} | {
		readonly code: "204";
		readonly information: "user.created";
		readonly body: undefined;
	};
} | {
	readonly method: "POST";
	readonly path: "/users/{userId}/posts";
	readonly params: {
		readonly userId: number;
	};
	readonly body: {
		readonly title: string;
		readonly content: string;
	};
	readonly responses: {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body: Error;
	} | {
		readonly code: "204";
		readonly information: "post.created";
		readonly body: undefined;
	};
} | {
	readonly method: "POST";
	readonly path: "/documents";
	readonly body: DCommon.TheFormData<{
		readonly bool: boolean;
		readonly myFile: readonly File[] & DArray.LengthEqual<1>;
		readonly name: string;
	}>;
	readonly responses: {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body: Error;
	} | {
		readonly code: "204";
		readonly information: "file.receive";
		readonly body: undefined;
	};
} | {
	readonly method: "GET";
	readonly path: "/posts";
	readonly query: {
		readonly page: number;
	};
	readonly responses: {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body: Error;
	} | {
		readonly code: "200";
		readonly information: "post.findMany";
		readonly body: readonly {
			readonly title: string;
			readonly content: string;
			readonly authorId: number;
		}[];
	};
};

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

// La méthode choisie filtre les paths et paramètres autorisés.
// L’appel retourne une `PromiseRequest` sur laquelle composer le traitement
// des réponses avant d’attendre le résultat avec `await`.
const promiseRequestCreateUser = client
	.post(
		"/users",
		{
			body: {
				username: "math",
				age: 23,
			},
		},
	);

const promiseRequestFindManyPost = client
	.get(
		"/posts",
		{
			query: {
				page: 3,
			},
		},
	);

// `TheFormData` se construit avec `createFormData`; le client l'envoie en
// `FormData` natif.
declare function getSelectedDocumentFile(): File;

const promiseRequestSendDocument = client
	.post(
		"/documents",
		{
			body: DCommon.createFormData({
				bool: true,
				myFile: DCommon.cast([getSelectedDocumentFile()]),
				name: "client/document.send",
			}),
		},
	);

// `when*` branche des effets de bord sur les réponses ciblées.
await client
	.get(
		"/posts",
		{
			query: {
				page: 3,
			},
		},
	)
	.whenInformation(
		"post.findMany",
		({ body }) => {
			// body: {
			//   title: string;
			//   content: string;
			//   authorId: number;
			// }[]
			void body;
		},
	)
	.whenCode(
		"422",
		({ information }) => {
			// information: "extract-error"
			void information;
		},
	);

// `iWant*` retourne un `Either` : réponse voulue en `right`, transport error
// ou réponse non voulue en `left`.
const maybeCreatedPost = await client
	.post(
		"/users/{userId}/posts",
		{
			params: {
				userId: 1,
			},
			body: {
				title: "Super article",
				content: "Super content of article",
			},
		},
	)
	.iWantInformation("post.created");

if (DEither.isRight(maybeCreatedPost)) {
	const response = DEither.unwrapRight(maybeCreatedPost);

	// information: "post.created"
	void response.information;
}

// `OrThrow` interrompt le flux lorsqu'une réponse inattendue apparaît.
const createdPostResponse = await client
	.post(
		"/users/{userId}/posts",
		{
			params: {
				userId: 1,
			},
			body: {
				title: "Super article",
				content: "Super content of article",
			},
		},
	)
	.iWantInformationOrThrow("post.created");

// `expected` regroupe les succès `2xx` et erreurs client `4xx`.
const maybeExpectedResponse = await client
	.get(
		"/posts",
		{
			query: {
				page: 3,
			},
		},
	)
	.iWantExpectedResponse();

if (DEither.isRight(maybeExpectedResponse)) {
	const response = DEither.unwrapRight(maybeExpectedResponse);

	// information: "post.findMany" | "extract-error"
	void response.information;
}

// Le sélecteur par `information` force un choix pour chaque réponse attendue.
const maybePosts = await client
	.get(
		"/posts",
		{
			query: {
				page: 3,
			},
		},
	)
	.iSelectExpectedResponseByInformation({
		"post.findMany": true,
		"extract-error": false,
	});

if (DEither.isRight(maybePosts)) {
	const response = DEither.unwrapRight(maybePosts);

	// body: {
	//   title: string;
	//   content: string;
	//   authorId: number;
	// }[]
	void response.body;
}

// Les familles `when*`, `iWant*` et `*OrThrow` ciblent une `information`, un
// code HTTP, une classe de statut ou les réponses attendues. Prioriser
// `information` pour exprimer un cas précis.
