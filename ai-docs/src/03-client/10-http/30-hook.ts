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
 *
 * En pratique, les hooks les plus sains sont souvent ceux qui produisent un
 * effet de bord : redirection, toast, loader, instrumentation.
 * Les hooks capables de transformer une requête ou une réponse existent.
 * Ils doivent être utilisés avec retenue : l'enrichissement produit par un
 * hook ne change pas le contrat typé de la route.
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

interface HookParams {
	readonly [key: string]: unknown;
	readonly requestId: string;
	readonly startedAt: number;
}

const client = createHttpClient<Routes, HookParams>({
	baseUrl: "http://localhost:1506",
});

declare function toast(message: string): void;
declare function startLoader(): void;
declare function stopLoader(): void;
declare function createRequestId(): string;
declare function getCurrentTime(): number;
declare function sendMetric(name: string, requestId: string, value: number): void;

// Les hooks de réaction sont adaptés aux effets de bord globaux.
// Ici, le loader suit le cycle réel de la requête : démarrage avant l'envoi,
// arrêt à la réception ou en cas d'erreur de transport.
client.addRequestHook(
	(requestParams) => {
		startLoader();

		return requestParams;
	},
);

client.addResponseHook(
	(response) => {
		stopLoader();

		return response;
	},
);

client.addErrorHook(
	() => {
		stopLoader();
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

// Un hook de transformation doit retourner la valeur transmise à l'étape
// suivante.
// Ce pattern reste utile pour enrichir le contexte technique des hooks,
// par exemple ajouter un identifiant de corrélation ou un timestamp.
// Ces données sont disponibles dans les hooks suivants, mais elles
// n'élargissent pas le typage métier de la réponse.
client.addRequestHook(
	(requestParams) => ({
		...requestParams,
		hookParams: {
			...requestParams.hookParams,
			requestId: createRequestId(),
			startedAt: getCurrentTime(),
		},
	}),
);

client.addResponseHook(
	(response) => {
		const hookParams = response.requestParams.hookParams;

		if (hookParams) {
			sendMetric(
				"http.request.duration",
				hookParams.requestId,
				getCurrentTime() - hookParams.startedAt,
			);
		}

		return response;
	},
);

// Les hooks n'empêchent pas de traiter la réponse localement.
// Ils évitent surtout de répéter les réactions globales autour du client.
const profile = await client
	.get("/profile")
	.iWantInformationOrThrow("profile.found");

void profile.body;
