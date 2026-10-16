/**
 * @title Consommer des événements SSE et un stream typés.
 *
 * La sélection de la réponse précède la lecture progressive du flux.
 */
import * as DHttpClient from "@duplojs/http/client";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

type Routes = {
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
} | {
	method: "GET";
	path: "/text-stream";
	responses: {
		code: "200";
		information: "text.open";
		flux: string;
	};
};

const client = DHttpClient.createHttpClient<Routes>({
	baseUrl: "https://duplo-api.example.com",
});

export async function consumeEvents(onProgress: (percent: number) => void) {
	const result = await client.get("/events").iWantInformation("events.open");

	if (DEither.isLeft(result)) {
		return result;
	}

	const response = DEither.unwrapRight(result);
	response.onReceiveEvent("progress", (event) => {
		type _CheckData = DCommon.ExpectType<typeof event.data, { percent: number }, "strict">;

		onProgress(event.data.percent);
	});
	response.onReceiveEvent("finished", (_event, stream) => {
		stream.closeEventStream();
	});

	// Enregistrer les callbacks ne démarre pas la lecture.
	await response.consumeEventStream();
	return DEither.ok();
}

export async function consumeText(onChunk: (chunk: string) => void) {
	// Cette réponse fournit predicted, x-duplojs-body-options: stream
	// et un content-type text/plain, cohérents avec le contrat flux: string.
	const result = await client.get("/text-stream").iWantInformation("text.open");

	if (DEither.isLeft(result)) {
		return result;
	}

	const response = DEither.unwrapRight(result);
	for await (const chunk of response) {
		type _CheckChunk = DCommon.ExpectType<typeof chunk, string, "strict">;

		onChunk(chunk);
	}

	return DEither.ok();
}
