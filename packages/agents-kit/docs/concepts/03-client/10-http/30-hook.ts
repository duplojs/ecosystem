/**
 * @title Utiliser les hooks du client HTTP
 *
 * Comportements transversaux et instrumentation du cycle des échanges HTTP.
 */
import { createHttpClient } from "@duplojs/http/client";

export type Routes = {
	readonly method: "GET";
	readonly path: "/profile";
	readonly responses: {
		readonly code: "401";
		readonly information: "auth.required";
		readonly body: undefined;
	} | {
		readonly code: "200";
		readonly information: "profile.found";
		readonly body: {
			readonly name: string;
			readonly email: string;
		};
	};
} | {
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

// Les hooks de cycle portent bien les effets globaux : loader, toast, métrique.
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

// Un hook de type de réponse applique une règle à toute une famille.
client.addClientErrorResponseTypeHook(
	(response) => {
		const message = getErrorMessage(response.information);

		if (message) {
			toast(message);
		}
	},
);

// Un hook de transformation peut enrichir le contexte technique des hooks
// suivants, sans modifier le contrat métier typé.
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

// La réponse reste traitée localement ; les hooks retirent les réactions
// globales répétitives.
const profile = await client
	.get("/profile")
	.iWantInformationOrThrow("profile.found");

void profile.body;
