/**
 * @title Utiliser les hooks du client HTTP
 *
 * Les hooks permettent de brancher un comportement commun sur le cycle
 * d'une requête.
 *
 * Ils peuvent être donnés dans la configuration du client, mais les helpers
 * `add*Hook` rendent souvent l'intention plus lisible.
 *
 * Les hooks de requête et de réponse permettent d'intervenir dans le flux :
 * ajouter un header, remplacer des paramètres, transformer une réponse.
 *
 * Les hooks ciblés par `information`, code ou type de réponse servent à
 * centraliser une réaction quand un cas précis apparaît, sans répéter ce
 * traitement autour de chaque requête.
 */
import { createHttpClient } from "@duplojs/http/client";

export type Routes = {
	method: "GET";
	path: "/profile";
	responses: {
		code: "401";
		information: "auth.required";
		body?: undefined;
	} | {
		code: "200";
		information: "profile.found";
		body: {
			name: string;
			email: string;
		};
	};
} | {
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
};

const client = createHttpClient<Routes>({
	baseUrl: "http://localhost:1506",
});

declare function getAuthToken(): string | undefined;
declare function redirectToLogin(): void;
declare function toast(message: string): void;

// Un hook de requête est exécuté avant l'envoi.
// Il peut enrichir les paramètres, par exemple ajouter un header commun.
// S'il interrompt le flux, la requête n'est pas envoyée.
client.addRequestHook(
	(requestParams) => {
		const token = getAuthToken();

		if (!token) {
			redirectToLogin();
			throw new Error("missing auth token");
		}

		return {
			...requestParams,
			headers: {
				...requestParams.headers,
				authorization: `Bearer ${token}`,
			},
		};
	},
);

// Les hooks ciblés par `information` permettent de centraliser une réaction
// liée à un cas de réponse précis.
client.addInformationHook(
	"auth.required",
	() => {
		redirectToLogin();
	},
);

function getErrorMessage(information: string | undefined) {
	if (information === "auth.required") {
		return "Vous devez être connecté.";
	}

	if (information === "extract-error") {
		return "Certaines données sont invalides.";
	}

	return undefined;
}

// Un hook de type de réponse est utile pour appliquer une règle commune
// à toute une famille de réponses.
// Ici, chaque erreur client connue peut afficher un toast à partir
// de son `information`.
client.addClientErrorResponseTypeHook(
	(response) => {
		const message = getErrorMessage(response.information);

		if (message) {
			toast(message);
		}
	},
);

// Les hooks n'empêchent pas de traiter la réponse localement.
// Ils évitent surtout de répéter les réactions globales autour du client.
const profile = await client
	.get("/profile")
	.iWantInformationOrThrow("profile.found");

void profile.body;
