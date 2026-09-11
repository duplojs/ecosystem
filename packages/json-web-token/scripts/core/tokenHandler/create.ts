import * as DCommon from "@duplojs/lang/common";
import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { encodeBase64Url } from "@scripts/utils";
import type { TokenHandlerConfig } from "./index";
import { nowInSeconds, resolveCipher, resolveSigner, type TokenHeaderContent, type TokenPayloadContent } from "./shared";

interface CreateTokenHandlerCreateMethodParams {
	readonly config: TokenHandlerConfig;
	readonly headerStructure: DDataStructure.Structure<TokenHeaderContent>;
	readonly payloadStructure: DDataStructure.Structure<TokenPayloadContent>;
}

export function createTokenHandlerCreateMethod(
	params: CreateTokenHandlerCreateMethodParams,
) {
	const { config, headerStructure, payloadStructure } = params;

	return async function(
		payload: object,
		params?: {
			header?: object;
			signer?: object;
			cipher?: object;
		},
	): Promise<
		| DEither.Right<"token-created", string>
		| DEither.Left<"header-encode-error", DDataStructure.Error>
		| DEither.Left<"payload-encode-error", DDataStructure.Error>
	> {
		const signer = resolveSigner(config.signer, params?.signer);
		const cipher = resolveCipher(config.cipher, params?.cipher);
		const issuedAt = nowInSeconds(config.now);
		const defaultHeaderValue = {
			typ: "JWT",
			alg: signer.algorithm,
		};
		const headerResult = headerStructure.unsafeEncode(
			DDataStructure.codecsJson,
			params?.header
				? {
					...params.header,
					...defaultHeaderValue,
				}
				: defaultHeaderValue,
		);
		if (DEither.isLeft(headerResult)) {
			return DEither.left("header-encode-error", DEither.unwrapLeft(headerResult));
		}

		const payloadResult = payloadStructure.unsafeEncode(
			DDataStructure.codecsJson,
			{
				iss: config.issuer,
				sub: config.subject,
				aud: config.audience,
				iat: issuedAt,
				exp: DChrono.computeTime(config.maxAge, "second") + issuedAt,
				...payload,
			},
		);
		if (DEither.isLeft(payloadResult)) {
			return DEither.left("payload-encode-error", DEither.unwrapLeft(payloadResult));
		}

		const encodedHeader = encodeBase64Url(JSON.stringify(DEither.unwrapRight(headerResult)));
		const encodedPayload = encodeBase64Url(JSON.stringify(DEither.unwrapRight(payloadResult)));
		const signingInput = `${encodedHeader}.${encodedPayload}`;

		return DCommon.callThen(
			signer.sign(signingInput),
			(signature) => {
				const token = `${signingInput}.${signature}`;

				if (cipher !== undefined) {
					return DCommon.callThen(
						cipher.encrypt(token),
						(token) => DEither.right("token-created", token),
					);
				}

				return DEither.right("token-created", token);
			},
		);
	};
}
