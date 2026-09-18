import { createKind } from "@core/kind";
import * as DKind from "@duplojs/lang/kind";

export class BodyParseWrongChunkReceived extends DKind.parentClass(
	createKind("body-parse-wrong-chunk-received"),
	Error,
) {
	public constructor(
		public information: string,
		public wrongChunk: unknown,
	) {
		super({}, `Received chunk is not ${information}`);
	}
}
