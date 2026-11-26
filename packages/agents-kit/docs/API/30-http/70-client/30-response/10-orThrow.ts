/**
 * @title PromiseRequest.OrThrow
 *
 * Obtenir la réponse sélectionnée ou lever une exception à la frontière finale.
 */
import { createHttpClient } from "@duplojs/http/client";

interface Routes {
	method: "GET";
	path: "/profile";
	responses: {
		code: "200";
		information: "profile.found";
		body: { name: string };
	};
}

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
});

const profile = await client
	.get("/profile")
	.iWantInformationOrThrow("profile.found");

// iWantInformationOrThrow, iWantCodeOrThrow, iWantInformationalResponseOrThrow,
// iWantSuccessfulResponseOrThrow, iWantRedirectionResponseOrThrow,
// iWantClientErrorResponseOrThrow, iWantServerErrorResponseOrThrow,
// iWantExpectedResponseOrThrow et iSelectExpectedResponseByInformationOrThrow
// déballent la réponse acceptée. En cas de Left, elles lèvent respectivement
// UnexpectedInformationResponseError, UnexpectedCodeResponseError,
// UnexpectedResponseTypeError pour une famille, ou UnexpectedResponseError
// pour expected et le sélecteur. La propriété response contient la réponse
// refusée ou le contenu d'une erreur de requête. Privilégier les variantes
// Either dans une fonction réutilisable ; OrThrow convient à une frontière qui
// décide d'interrompre l'exécution. Les exceptions indépendantes restent possibles.
