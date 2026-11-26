/**
 * @title PromiseRequest.when
 *
 * Observer les réponses ou les erreurs sans sélectionner le résultat.
 */
import { createHttpClient } from "@duplojs/http/client";
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
		body: undefined;
	};
}

declare function displayName(name: string): void;
declare function requireAuthentication(): void;

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
});

const request = client
	.get("/profile")
	.whenInformation(
		"profile.found",
		({ body }) => {
			type CheckBody = DCommon.ExpectType<
				typeof body,
				{ name: string },
				"strict"
			>;

			displayName(body.name);
		},
	)
	.whenCode("401", requireAuthentication);

// whenInformation et whenCode acceptent une valeur ou un tableau et affinent
// le type de la réponse reçue par le callback. whenInformationalResponse, whenSuccessfulResponse,
// whenRedirectionResponse, whenClientErrorResponse et whenServerErrorResponse
// ciblent respectivement 1xx à 5xx. whenExpectedResponse cible 2xx et 4xx.
// whenError observe les exceptions du cycle de hooks avec les paramètres ;
// les erreurs fetch capturées dans request-error ne le déclenchent pas forcément ;
// whenNotPredictedResponse observe une réponse non marquée en mode predicted.
// Ces méthodes renvoient la même PromiseRequest ; leurs callbacks ne changent
// pas la sélection. Les callbacks sont enregistrés avant l'attente.
