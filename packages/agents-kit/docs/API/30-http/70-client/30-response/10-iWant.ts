/**
 * @title PromiseRequest.iWant et iSelectExpectedResponseByInformation
 *
 * Sélectionner les réponses acceptées et conserver les refus dans un Either.
 */
import { createHttpClient } from "@duplojs/http/client";
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
		body: undefined;
	};
}

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
});

const result = await client
	.get("/profile")
	.iWantInformation("profile.found");

if (DEither.isRight(result)) {
	const response = DEither.unwrapRight(result);

	type CheckBody = DCommon.ExpectType<
		typeof response.body,
		{ name: string },
		"strict"
	>;
}

const selected = await client
	.get("/profile")
	.iSelectExpectedResponseByInformation({
		"profile.found": true,
		"auth.required": false,
	});

// iWantInformation et iWantCode acceptent une valeur ou un tableau.
// iWantInformationalResponse, iWantSuccessfulResponse, iWantRedirectionResponse,
// iWantClientErrorResponse et iWantServerErrorResponse sélectionnent les
// familles 1xx à 5xx. iWantExpectedResponse accepte 2xx et 4xx ; expected ne
// signifie pas toutes les réponses du contrat.
// iSelectExpectedResponseByInformation exige une décision pour chaque
// information déclarée : true accepte et false refuse. Les variantes acceptées
// forment un Right "response" dont le type est affiné. Une réponse refusée,
// absente du sélecteur ou sans marqueur predicted lorsque le mode est actif
// produit un Left "unexpect-response" contenant la réponse. Une erreur de
// requête produit un Left "request-error". La sélection retourne une promesse
// d'Either : il n'est plus possible de configurer la PromiseRequest après cet appel.
