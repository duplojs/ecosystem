/**
 * @title PromiseRequest.toEitherByInformation et toEitherByCode
 *
 * Répartir les réponses du contrat dans un Either selon leur information ou leur code.
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

const byInformation = await client
	.get("/profile")
	.toEitherByInformation({
		"profile.found": true,
		"auth.required": false,
	});

if (DEither.hasInformation(byInformation, "profile.found")) {
	const response = DEither.unwrapRight(byInformation);

	type CheckCode = DCommon.ExpectType<
		typeof response.code,
		"200",
		"strict"
	>;
}

const byCode = await client
	.get("/profile")
	.toEitherByCode({
		200: true,
		401: true,
	});

if (DEither.hasInformation(byCode, "response-401")) {
	const response = DEither.unwrapRight(byCode);

	type CheckInformation = DCommon.ExpectType<
		typeof response.information,
		"auth.required",
		"strict"
	>;
}

// Le sélecteur couvre toutes les informations ou tous les codes du contrat.
// true produit un Right nommé par l'information ou "response-<code>" ; false
// produit Left "unexpect-response". Les réponses non prédites en mode actif et
// les erreurs de requête restent des Left. Contrairement à iSelect, les Right
// portent chacun leur propre information, ce qui permet de les distinguer.
