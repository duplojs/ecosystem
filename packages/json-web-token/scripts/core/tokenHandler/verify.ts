import * as DCommon from "@duplojs/lang/common";
import type * as DChrono from "@duplojs/lang/chrono";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { isBase64Url } from "@scripts/utils";
import type { TokenHandlerConfig } from "./index";
import { getToleranceInSeconds, isAudienceValid, nowInSeconds, resolveCipher, resolveSigner, type DecodeTokenContent } from "./shared";

interface CreateTokenHandlerVerifyMethodParams {
	readonly config: TokenHandlerConfig;
	readonly decodeTokenContent: DecodeTokenContent;
}

export function createTokenHandlerVerifyMethod(
	params: CreateTokenHandlerVerifyMethodParams,
) {
	const { decodeTokenContent, config } = params;

	return async function(
		token: string,
		params?: {
			signer?: object;
			cipher?: object;
			tolerance?: DChrono.TheTime;
		},
	): Promise<
		| DEither.Right<"token-verified", {
			header: Record<string, unknown>;
			payload: Record<string, unknown>;
		}>
		| DEither.Left<"token-format">
		| DEither.Left<"header-json-error">
		| DEither.Left<"header-decode-error", DDataStructure.Error>
		| DEither.Left<"payload-json-error">
		| DEither.Left<"payload-decode-error", DDataStructure.Error>
		| DEither.Left<"signature-invalid">
		| DEither.Left<"issue-invalid">
		| DEither.Left<"subject-invalid">
		| DEither.Left<"audience-invalid">
		| DEither.Left<"expired">
	> {
		const cipher = resolveCipher(config.cipher, params?.cipher);
		const decryptedToken = cipher === undefined
			? token
			: cipher.decrypt(token);

		return DCommon.callThen(
			decryptedToken,
			(token: string) => {
				const [encodedHeader, encodedPayload, signature] = token.split(".");

				if (!signature || !isBase64Url(signature)) {
					return DEither.left("signature-invalid");
				}

				const decodeResult = decodeTokenContent(
					encodedHeader,
					encodedPayload,
				);

				if (DEither.isLeft(decodeResult)) {
					return decodeResult;
				}

				const signer = resolveSigner(config.signer, params?.signer);

				return DCommon.callThen(
					signer.verify(
						`${encodedHeader}.${encodedPayload}`,
						signature,
					),
					(isValid) => {
						if (!isValid) {
							return DEither.left("signature-invalid");
						}

						if (
							typeof config.issuer !== "undefined"
							&& decodeResult.payload.iss !== config.issuer
						) {
							return DEither.left("issue-invalid");
						}

						if (
							typeof config.subject !== "undefined"
							&& decodeResult.payload.sub !== config.subject
						) {
							return DEither.left("subject-invalid");
						}

						if (
							!isAudienceValid(
								config.audience,
								decodeResult.payload.aud,
							)
						) {
							return DEither.left("audience-invalid");
						}

						if (
							(decodeResult.payload.exp + getToleranceInSeconds(params?.tolerance))
							< nowInSeconds(config.now)
						) {
							return DEither.left("expired");
						}

						return DEither.right(
							"token-verified",
							{
								header: decodeResult.header,
								payload: decodeResult.payload,
							},
						);
					},
				);
			},
		);
	};
}
