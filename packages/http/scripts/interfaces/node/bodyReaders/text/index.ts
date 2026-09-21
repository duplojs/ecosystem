import { TextBodyController } from "@core/request";
import { readRequestText } from "./readRequestText";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import { type HttpServerParams } from "@core/types";
import { ParseJsonError, WrongContentTypeError } from "@core/errors";
import * as DString from "@duplojs/lang/string";
import * as DDataStructure from "@duplojs/lang/dataStructure";
export * from "./readRequestText";

export function createTextBodyReaderImplementation(serverParams: HttpServerParams) {
	const serverMaxBodySize = DCommon.stringToBytes(serverParams.maxBodySize);

	return TextBodyController.createReaderImplementation(
		async(request, params) => {
			if (
				!request.headers["content-type"]?.includes("application/json")
				&& !request.headers["content-type"]?.includes("text/plain")
			) {
				return DEither.left(
					"reader-error",
					new WrongContentTypeError(
						"application/json or text/plain",
						DString.join(DArray.coalescing(request.headers["content-type"] ?? ""), " "),
					),
				);
			}

			const result = await readRequestText(
				request.raw.request,
				{ maxBodySize: params.bodyMaxSize ?? serverMaxBodySize },
				(result) => {
					if (request.headers["content-type"]?.includes("application/json")) {
						try {
							return DEither.success(
								JSON.parse(result) as DCommon.Json,
							);
						} catch (error) {
							return DEither.left(
								"reader-error",
								new ParseJsonError(result, error),
							);
						}
					}

					return DEither.success(result);
				},
			);

			if (DEither.isLeft(result)) {
				// mandatory in case of error to avoid monopolizing the client connection if a stream is not finished.
				request.raw.response.setHeader("Connection", "close");
			}

			if (DEither.hasInformation(result, "server-error")) {
				throw DEither.unwrapLeft(result);
			}

			return result;
		},
		DDataStructure.codecsJson,
	);
}
