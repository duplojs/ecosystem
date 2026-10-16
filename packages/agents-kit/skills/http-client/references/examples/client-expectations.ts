/**
 * @title Choisir les réponses voulues depuis une PromiseRequest.
 *
 * Les sélecteurs imposent un choix pour chaque cas du contrat de la requête.
 */
import * as DHttpClient from "@duplojs/http/client";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

interface Routes {
	method: "GET";
	path: "/profile";
	responses: {
		code: "200";
		information: "profile.found";
		body: { name: string };
	} | {
		code: "401";
		information: "auth.required";
	};
}

const client = DHttpClient.createHttpClient<Routes>({
	baseUrl: "https://duplo-api.example.com",
	// Le mode Predicted reste actif pour cette API DuploJS.
});

export function requestProfile(onAuthenticationRequired: () => void) {
	return client.get("/profile")
		.addRequestInterceptor((params) => ({
			...params,
			headers: {
				...params.headers,
				"x-request-source": "profile-page",
			},
		}))
		.whenInformation("auth.required", onAuthenticationRequired);
}

export async function selectProfile(onAuthenticationRequired: () => void) {
	const result = await requestProfile(onAuthenticationRequired)
		.toEitherByInformation({
			"profile.found": true,
			"auth.required": false,
		});

	if (DEither.hasInformation(result, "profile.found")) {
		const response = DEither.unwrapRight(result);

		type _CheckCode = DCommon.ExpectType<typeof response.code, "200", "strict">;
		type _CheckBody = DCommon.ExpectType<typeof response.body, { name: string }, "strict">;

		return response.body;
	}

	// Les autres branches portent unexpect-response ou request-error.
	return result;
}

export async function classifyProfileByCode() {
	const result = await client.get("/profile").toEitherByCode({
		200: true,
		401: true,
	});

	// Une erreur métier peut être un résultat voulu à cet endroit du programme.
	if (DEither.hasInformation(result, "response-401")) {
		const response = DEither.unwrapRight(result);

		type _CheckInformation = DCommon.ExpectType<typeof response.information, "auth.required", "strict">;
		void response;
	}

	return result;
}

// Illustration de compilation, sans créer de requête supplémentaire.
export function checkSelectorContract(request: ReturnType<typeof client.get>) {
	// @ts-expect-error Le sélecteur doit aussi décider du cas auth.required.
	void request.toEitherByInformation({ "profile.found": true });

	// @ts-expect-error Le sélecteur doit aussi décider du code 401.
	void request.toEitherByCode({ 200: true });
}
