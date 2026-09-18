import { BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "@core/errors";
import * as DEither from "@duplojs/lang/either";
import type http from "http";

export interface ReadRequestTextParams {
	maxBodySize: number;
}

export async function readRequestText<
	GenericOutputValue extends unknown = string,
>(
	request: http.IncomingMessage,
	params: ReadRequestTextParams,
	onEnd?: (result: string) => GenericOutputValue,
): Promise<
	| DEither.Left<"server-error", unknown>
	| DEither.Error<Error>
	| GenericOutputValue
> {
	let result = "";
	let size = 0;

	try {
		for await (const chunk of request) {
			if (!(chunk instanceof Buffer) && typeof chunk !== "string") {
				return DEither.error(new BodyParseWrongChunkReceived("Buffer or String.", chunk));
			}

			size += chunk instanceof Buffer
				? chunk.byteLength
				: Buffer.byteLength(chunk);

			if (size > params.maxBodySize) {
				return DEither.error(new BodySizeExceedsLimitError(params.maxBodySize));
			}

			result += chunk.toString();
		}

		if (onEnd) {
			return await onEnd(result);
		}

		return result as GenericOutputValue;
	} catch (error) {
		return DEither.left("server-error", error);
	} finally {
		request.destroy();
	}
}
