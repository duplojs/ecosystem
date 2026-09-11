import * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { TokenHandlerConfig } from "./index";
import { resolveCipher, type DecodeTokenContent } from "./shared";

interface CreateTokenHandlerDecodeMethodParams {
	readonly config: TokenHandlerConfig;
	readonly decodeTokenContent: DecodeTokenContent;
}

export function createTokenHandlerDecodeMethod(
	params: CreateTokenHandlerDecodeMethodParams,
) {
	const { config, decodeTokenContent } = params;

	return async function(
		token: string,
		params?: {
			cipher?: object;
		},
	): Promise<
		| DEither.Right<"token-decoded", {
			header: Record<string, unknown>;
			payload: Record<string, unknown>;
		}>
		| DEither.Left<"token-format">
		| DEither.Left<"header-json-error">
		| DEither.Left<"header-decode-error", DDataStructure.Error>
		| DEither.Left<"payload-json-error">
		| DEither.Left<"payload-decode-error", DDataStructure.Error>
	> {
		const cipher = resolveCipher(config.cipher, params?.cipher);
		const decryptedToken = cipher === undefined
			? token
			: cipher.decrypt(token);

		return DCommon.callThen(
			decryptedToken,
			(token) => {
				const [encodedHeader, encodedPayload] = token.split(".");

				const decodeResult = decodeTokenContent(
					encodedHeader,
					encodedPayload,
				);

				if (DEither.isLeft(decodeResult)) {
					return decodeResult;
				}

				return DEither.right(
					"token-decoded",
					{
						header: decodeResult.header,
						payload: decodeResult.payload,
					},
				);
			},
		);
	};
}
