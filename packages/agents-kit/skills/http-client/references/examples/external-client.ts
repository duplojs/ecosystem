/**
 * @title Typer une API externe sans génération DuploJS.
 *
 * Le contrat est écrit à la main ; les réponses n'ont aucun header DuploJS.
 */
import * as DHttpClient from "@duplojs/http/client";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

interface ExternalRoutes {
	method: "GET";
	path: "/users/{userId}";
	params: {
		userId: number;
	};
	responses: {
		code: "200";
		// Rendre l'absence explicite préserve l'inférence avec l'API actuelle.
		information?: undefined;
		body: {
			id: number;
			name: string;
		};
	} | {
		code: "404";
		information?: undefined;
		body: {
			message: string;
		};
	};
}

export const externalClient = DHttpClient.createHttpClient<ExternalRoutes>({
	baseUrl: "https://api.example.com",
	// L'API ne fournit pas le marqueur de réponses prévues.
	disabledPredictedMode: true,
});

export function configureExternalClient(getToken: () => string) {
	externalClient.addDefaultHeader("authorization", () => `Bearer ${getToken()}`);
	// Transformer ici les options communes à tous les appels de cette API.
	externalClient.addRequestHook((params) => ({
		...params,
		initParams: {
			...params.initParams,
			credentials: "omit",
		},
	}));
}

export async function readExternalUser(userId: number) {
	const result = await externalClient
		.get("/users/{userId}", { params: { userId } })
		.whenCode("404", ({ body }) => {
			type _CheckError = DCommon.ExpectType<typeof body, { message: string }, "strict">;
			console.log(body.message);
		})
		.iWantCode("200");

	if (DEither.isRight(result)) {
		const response = DEither.unwrapRight(result);

		type _CheckBody = DCommon.ExpectType<
			typeof response.body,
			{
				id: number;
				name: string;
			},
			"strict"
		>;

		return DEither.success(response.body);
	}

	// Le 404 et les autres réponses reçues restent accessibles via unexpect-response.
	// Les erreurs de transport ou de traitement portent request-error.
	return result;
}
