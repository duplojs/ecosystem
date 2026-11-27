/**
 * @title Server-Sent Events
 *
 * Sélectionner et consommer les événements SSE typés d'une réponse.
 */
import { createHttpClient } from "@duplojs/http/client";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

interface Routes {
	method: "GET";
	path: "/events";
	responses: {
		code: "200";
		information: "events.open";
		events: {
			progress: { percent: number };
			finished: { id: string };
		};
	};
}

declare function updateProgress(percent: number): void;

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
});

const result = await client
	.get("/events")
	.whenReceiveServerEvent(
		"progress",
		(event) => updateProgress(event.data.percent),
	)
	.iWantInformation("events.open");

if (DEither.isRight(result)) {
	const response = DEither.unwrapRight(result);

	response.onReceiveEvent(
		"progress",
		(event) => {
			type CheckData = DCommon.ExpectType<
				typeof event.data,
				{ percent: number },
				"strict"
			>;

			updateProgress(event.data.percent);
		},
	);

	response.onReceiveEvent(
		"finished",
		(_event, stream) => stream.closeEventStream(),
	);

	await response.consumeEventStream();
}

// text/event-stream active le traitement SSE. events décrit statiquement les
// noms et data ; event, data, id et retry sont les champs des événements reçus.
// data est parsé en JSON lorsque le content-type de l'événement indique JSON,
// sinon c'est du texte. L'enregistrement ne lance pas la lecture : utiliser
// consumeEventStream ou l'itération asynchrone. closeEventStream interrompt la
// lecture. onStreamEvent observe start, close, error, beforeRetry ou
// receiveServerEvents. Le client expose addStartServerEventHook,
// addCloseServerEventHook, addErrorServerEventHook, addBeforeRetryServerEventHook
// et addReceiveEventServerEventHook pour les réactions globales. Une reconnexion
// utilise le délai retry reçu, ou 3000 ms par défaut.
