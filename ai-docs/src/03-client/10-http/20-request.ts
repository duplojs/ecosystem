/**
 * @title Effectuer une requête HTTP
 *
 * Les méthodes `get`, `post`, `patch`, `put`, `delete` et `request`
 * créent une `PromiseRequest`.
 *
 * Une `PromiseRequest` lance la requête et ajoute des méthodes de traitement
 * autour de la réponse typée.
 *
 * Le pattern principal consiste à :
 * - construire la requête avec les paramètres attendus par la route
 * - choisir une manière de traiter la réponse selon le besoin
 * - discriminer en priorité par `information`, plus stable et explicite
 *   que le statut HTTP
 */
import { createHttpClient } from "@duplojs/http/client";
import type * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export type Routes = {
	method: "POST";
	path: "/users";
	body: {
		username: string;
		age: number;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "204";
		information: "user.created";
		body?: undefined;
	};
} | {
	method: "POST";
	path: "/users/{userId}/posts";
	params: {
		userId: number;
	};
	body: {
		title: string;
		content: string;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "204";
		information: "post.created";
		body?: undefined;
	};
} | {
	method: "POST";
	path: "/documents";
	body: DCommon.TheFormData<{
		bool: boolean;
		myFile: readonly File[] & DArray.LengthEqual<1>;
		name: string;
	}>;
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "204";
		information: "file.receive";
		body?: undefined;
	};
} | {
	method: "GET";
	path: "/posts";
	query: {
		page: number;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "post.findMany";
		body: {
			title: string;
			content: string;
			authorId: number;
		}[];
	};
};

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

// Les helpers HTTP filtrent les paths et les paramètres à partir
// de la méthode utilisée.
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

// Pour une route qui attend un `TheFormData`, le body est créé avec
// `DCommon.createFormData`.
// Le client transforme ensuite cette valeur en `FormData` natif au moment
// de l'envoi.
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

// Les méthodes `when*` enregistrent des callbacks sur la `PromiseRequest`.
// Elles sont adaptées aux traitements par effet de bord, par exemple
// mettre à jour un état d'interface.
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

// Les méthodes `iWant*` récupèrent une famille de réponse sous forme d'Either.
// La branche `right` contient la réponse voulue.
// La branche `left` contient soit une erreur de requête, soit une réponse
// qui ne correspond pas à ce qui était demandé.
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

// Les variantes `OrThrow` sont utiles quand une réponse inattendue doit
// interrompre directement le flux courant.
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

// `expected` regroupe les réponses attendues dans un flux applicatif classique :
// succès `2xx` et erreurs client `4xx`.
// Il exclut notamment les redirections et erreurs serveur du résultat voulu.
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

// Lorsqu'il faut être explicite sur toutes les informations possibles,
// `iSelectExpectedResponseByInformation` demande un choix pour chaque
// `information` déclarée sur la route.
// Si une nouvelle information apparaît dans le contrat de route,
// le sélecteur devra être mis à jour.
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

// Les familles disponibles suivent la même intention :
// - `when*` : callbacks sur la `PromiseRequest`
// - `iWant*` : résultat voulu sous forme d'Either
// - `*OrThrow` : résultat voulu ou exception
//
// Elles peuvent cibler une `information`, un code HTTP, une classe de statut
// ou les réponses attendues. Le code HTTP reste utile pour traiter une classe
// technique de réponse, mais `information` est à prioriser pour exprimer
// un cas précis : une même route peut produire plusieurs réponses avec
// le même code, alors qu'une `information` représente un cas de réponse.
