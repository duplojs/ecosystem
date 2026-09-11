import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { decodeBase64Url, decodeText, isBase64Url, jsonParse } from "@scripts/utils";

export type TokenHeaderContent = {
	typ: "JWT";
	alg: string;
} & Record<string, unknown>;

export interface TokenPayloadContent {
	[key: string]: unknown;
	iss?: string;
	sub?: string;
	aud?: string | readonly string[];
	exp: number;
	iat: number;
}

interface CreateDecodeTokenContentParams {
	readonly headerStructure: DDataStructure.Structure<TokenHeaderContent>;
	readonly payloadStructure: DDataStructure.Structure<TokenPayloadContent>;
}

export type DecodeTokenContentResult = (
	| {
		header: TokenHeaderContent;
		payload: TokenPayloadContent;
	}
	| DEither.Left<"token-format">
	| DEither.Left<"header-json-error">
	| DEither.Left<"header-decode-error", DDataStructure.Error>
	| DEither.Left<"payload-json-error">
	| DEither.Left<"payload-decode-error", DDataStructure.Error>
);

export type DecodeTokenContent = (
	encodedHeader: string | undefined,
	encodedPayload: string | undefined,
) => DecodeTokenContentResult;

export function createDecodeTokenContent(
	params: CreateDecodeTokenContentParams,
): DecodeTokenContent {
	return (encodedHeader, encodedPayload) => {
		if (
			!encodedHeader
			|| !encodedPayload
			|| !isBase64Url(encodedHeader)
			|| !isBase64Url(encodedPayload)
		) {
			return DEither.left("token-format");
		}

		const headerJsonResult = jsonParse(
			decodeText(decodeBase64Url(encodedHeader)),
		);
		if (headerJsonResult === undefined) {
			return DEither.left("header-json-error");
		}

		const headerResult = params.headerStructure.unsafeDecode(
			DDataStructure.codecsJson,
			headerJsonResult,
		);
		if (DEither.isLeft(headerResult)) {
			return DEither.left("header-decode-error", DEither.unwrapLeft(headerResult));
		}

		const payloadJsonResult = jsonParse(
			decodeText(decodeBase64Url(encodedPayload)),
		);
		if (payloadJsonResult === undefined) {
			return DEither.left("payload-json-error");
		}

		const payloadResult = params.payloadStructure.unsafeDecode(
			DDataStructure.codecsJson,
			payloadJsonResult,
		);
		if (DEither.isLeft(payloadResult)) {
			return DEither.left("payload-decode-error", DEither.unwrapLeft(payloadResult));
		}

		return {
			header: DEither.unwrapRight(headerResult),
			payload: DEither.unwrapRight(payloadResult),
		};
	};
}
