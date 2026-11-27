/**
 * @title Flux de données
 *
 * Consommer des chunks texte ou binaires sans les confondre avec les SSE.
 */
import { createHttpClient } from "@duplojs/http/client";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";
import type * as DCommon from "@duplojs/lang/common";

type Routes = {
	method: "GET";
	path: "/stream";
	responses: {
		code: "200";
		information: "stream.open";
		flux: string;
	};
} | {
	method: "GET";
	path: "/binary";
	responses: {
		code: "200";
		information: "binary.open";
		flux: Uint8Array<ArrayBuffer>;
	};
};

declare function acceptText(chunk: string): void;
declare function acceptBytes(chunk: Uint8Array<ArrayBuffer>): void;

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
});

const text = await client
	.get("/stream")
	.whenReceiveDataStream(acceptText)
	.iWantInformation("stream.open");

if (DEither.isRight(text)) {
	const response = DEither.unwrapRight(text);

	response.onStream(
		"receiveData",
		(chunk) => {
			type CheckChunk = DCommon.ExpectType<
				typeof chunk,
				string,
				"strict"
			>;

			acceptText(chunk);
		},
	);

	await response.consumeStream();
}

const binary = await client
	.get("/binary")
	.iWantInformation("binary.open");

if (DEither.isRight(binary)) {
	const response = DEither.unwrapRight(binary);

	// La réponse est un AsyncIterable : le parcours lance aussi la lecture.
	const receivedBytes = await DGenerator.asyncReduce(
		response,
		0,
		({ item, lastValue, next }) => {
			acceptBytes(item);

			return next(DNumber.sum([lastValue, item.byteLength]));
		},
	);

	// receivedBytes compte les octets lus lorsque le flux se ferme.
}

// Le header x-duplojs-body-options contenant stream active ce traitement.
// Un content-type contenant text décode les chunks en texte ; sinon ils sont
// binaires. Le contrat flux ne transforme pas les données au runtime. Les
// chunks ne correspondent pas nécessairement à des messages complets.
// onStream observe start, receiveData, error et close ; consumeStream ou
// l'itération asynchrone lance la lecture ; closeStream l'interrompt. Les hooks
// globaux sont addStartStreamHook, addReceiveDataStreamHook, addErrorStreamHook
// et addCloseStreamHook.
