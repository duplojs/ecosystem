import * as DCommon from "@duplojs/lang/common";
import type * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type * as DObject from "@duplojs/lang/object";
import * as DKind from "@duplojs/lang/kind";
import { createKind } from "@scripts/kind";
import type { CreateSigner, Signer } from "../signer";
import type { CreateCipher, Cipher } from "../cipher";
import type { ExtractRequiredKeys, UnknownToUndefined } from "../types";
import { createTokenHandlerCreateMethod } from "./create";
import { createTokenHandlerDecodeMethod } from "./decode";
import { createTokenHandlerVerifyMethod } from "./verify";
import { createDecodeTokenContent } from "./shared";

const tokenHandlerConfigDataStructure = DDataStructure.object({
	issuer: DDataStructure.optional(DDataStructure.string()),
	audience: DDataStructure.optional(
		DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.array(DDataStructure.string()),
		]),
	),
	subject: DDataStructure.optional(DDataStructure.string()),
	maxAge: DDataStructure.time(),
});

export type TokenHandlerConfig<
	GenericSignerAlgorithm extends string = string,
	GenericCipherAlgorithm extends string = string,
> = DCommon.SimplifyTopLevel<
	& {
		now?(): DChrono.TheDate;
		signer: Signer<GenericSignerAlgorithm> | CreateSigner<GenericSignerAlgorithm, any>;
		cipher?: Cipher<GenericCipherAlgorithm> | CreateCipher<GenericCipherAlgorithm, any>;
	}
	& DDataStructure.StructureValue<typeof tokenHandlerConfigDataStructure>
>;

type SignerAlgorithm<
	GenericSignerAlgorithm extends Signer | CreateSigner<string, any>,
> = GenericSignerAlgorithm extends (...args: any[]) => { algorithm: infer InferredAlgorithm }
	? InferredAlgorithm
	: GenericSignerAlgorithm extends { algorithm: infer InferredAlgorithm }
		? InferredAlgorithm
		: never;

export type DefaultTokenHeaderKeys = "typ" | "alg";
export type DefaultTokenPayloadKeys = "iss" | "sub" | "aud" | "exp" | "iat";

export interface DecodeOutput<
	GenericTokenHandlerConfig extends TokenHandlerConfig,
	GenericCustomPayload extends Record<string, unknown>,
	GenericCustomHeader extends Record<string, unknown>,
> {
	readonly header: DCommon.SimplifyTopLevel<
	{
		readonly typ: "JWT";
		readonly alg: SignerAlgorithm<GenericTokenHandlerConfig["signer"]>;
	}
	& Readonly<GenericCustomHeader>
	>;
	readonly payload: DCommon.SimplifyTopLevel<
	{
		readonly iss: UnknownToUndefined<GenericTokenHandlerConfig["issuer"]>;
		readonly sub: UnknownToUndefined<GenericTokenHandlerConfig["subject"]>;
		readonly aud: UnknownToUndefined<GenericTokenHandlerConfig["audience"]>;
		readonly exp: number;
		readonly iat: number;
	}
	& Readonly<GenericCustomPayload>
	>;
}

type VerifyParams<
	GenericTokenHandlerConfig extends TokenHandlerConfig,
> =
	& (
		GenericTokenHandlerConfig["signer"] extends (params: infer InferredSignerParams) => any
			? { signer: InferredSignerParams }
			: {}
	)
	& (
		GenericTokenHandlerConfig["cipher"] extends (params: infer InferredCipherParams) => any
			? { cipher: InferredCipherParams }
			: {}
	)
	& {
		tolerance?: DChrono.TheTime;
	};

type CreateParams<
	GenericTokenHandlerConfig extends TokenHandlerConfig,
	GenericCustomHeader extends Record<string, unknown>,
> =
	& (
		GenericTokenHandlerConfig["signer"] extends (params: infer InferredSignerParams) => any
			? { signer: InferredSignerParams }
			: {}
	)
	& (
		GenericTokenHandlerConfig["cipher"] extends (params: infer InferredCipherParams) => any
			? { cipher: InferredCipherParams }
			: {}
	)
	& (
		keyof GenericCustomHeader extends never
			? {}
			: ExtractRequiredKeys<GenericCustomHeader> extends never
				? { header?: GenericCustomHeader }
				: { header: GenericCustomHeader }
	);

type DecodeParams<
	GenericTokenHandlerConfig extends TokenHandlerConfig,
> =
	& (
		GenericTokenHandlerConfig["cipher"] extends (params: infer InferredCipherParams) => any
			? { cipher: InferredCipherParams }
			: {}
	);

type ComputeParams<
	GenericParams extends object,
> = keyof GenericParams extends never
	? []
	: ExtractRequiredKeys<GenericParams> extends never
		? [params?: GenericParams]
		: [params: GenericParams];

const tokenHandlerKind = createKind("token-handler");

export interface TokenHandler<
	GenericTokenHandlerConfig extends TokenHandlerConfig = TokenHandlerConfig,
	GenericCustomPayload extends Record<string, unknown> = {},
	GenericCustomHeader extends Record<string, unknown> = {},
>extends DKind.Kind<typeof tokenHandlerKind> {

	verify(
		token: string,
		...args: ComputeParams<VerifyParams<GenericTokenHandlerConfig>>
	): Promise<
		| DEither.Right<"token-verified", DCommon.SimplifyTopLevel<DecodeOutput<GenericTokenHandlerConfig, GenericCustomPayload, GenericCustomHeader>>>
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
	>;

	decode(
		token: string,
		...args: ComputeParams<DecodeParams<GenericTokenHandlerConfig>>
	): Promise<
		| DEither.Right<"token-decoded", DCommon.SimplifyTopLevel<DecodeOutput<GenericTokenHandlerConfig, GenericCustomPayload, GenericCustomHeader>>>
		| DEither.Left<"token-format">
		| DEither.Left<"header-json-error">
		| DEither.Left<"header-decode-error", DDataStructure.Error>
		| DEither.Left<"payload-json-error">
		| DEither.Left<"payload-decode-error", DDataStructure.Error>
	>;

	create(
		payload: GenericCustomPayload,
		...args: ComputeParams<CreateParams<GenericTokenHandlerConfig, GenericCustomHeader>>
	): Promise<
		| DEither.Right<"token-created", string>
		| DEither.Left<"header-encode-error", DDataStructure.Error>
		| DEither.Left<"payload-encode-error", DDataStructure.Error>
	>;

	createOrThrow(
		payload: GenericCustomPayload,
		...args: ComputeParams<CreateParams<GenericTokenHandlerConfig, GenericCustomHeader>>
	): Promise<string>;
}

export class TokenHandlerWrongConfig extends DKind.parentClass(
	tokenHandlerKind,
	Error,
) {
	public constructor(_error: DEither.Left) {
		super(undefined, "Token handler config is wrong. Please check your definition shape.");
	}
}

export class TokenHandlerCreateError extends DKind.parentClass(
	tokenHandlerKind,
	Error,
) {
	public constructor(error: DEither.Left) {
		super(undefined, `Token creation failed with "${DEither.informationKind.getValue(error)}".`);
	}
}

export function createTokenHandler<
	GenericTokenHandlerConfig extends TokenHandlerConfig,
	GenericCustomPayload extends DDataStructure.ShapeObjectStructure,
	GenericCustomHeader extends DDataStructure.ShapeObjectStructure = {},
>(
	params: (
		& GenericTokenHandlerConfig
		& {
			readonly customPayloadShape:(
				& GenericCustomPayload
				& DObject.ForbiddenKey<GenericCustomPayload, DefaultTokenPayloadKeys>
			);
			readonly customHeaderShape?: (
				& GenericCustomHeader
				& DObject.ForbiddenKey<GenericCustomHeader, DefaultTokenHeaderKeys>
			);
		}
	),
): TokenHandler<
	GenericTokenHandlerConfig,
	DDataStructure.ShapeObjectStructureValue<GenericCustomPayload>,
	DDataStructure.ShapeObjectStructureValue<GenericCustomHeader>
> {
	const configResult = tokenHandlerConfigDataStructure.check({
		issuer: params.issuer,
		audience: params.audience,
		subject: params.subject,
		maxAge: params.maxAge,
	});

	if (DEither.isLeft(configResult)) {
		throw new TokenHandlerWrongConfig(configResult);
	}

	const config = {
		...DEither.unwrapRight(configResult),
		now: params.now,
		signer: params.signer,
		cipher: params.cipher,
	};

	const payloadStructure = DDataStructure.object({
		iss: DDataStructure.optional(DDataStructure.string()),
		sub: DDataStructure.optional(DDataStructure.string()),
		aud: DDataStructure.optional(
			DDataStructure.union([
				DDataStructure.string(),
				DDataStructure.array(DDataStructure.string()),
			]),
		),
		exp: DDataStructure.number(),
		iat: DDataStructure.number(),
		...DCommon.forward<DDataStructure.ShapeObjectStructure>(params.customPayloadShape),
	});
	const headerStructure = DDataStructure.object({
		...(params.customHeaderShape ?? {}),
		typ: DDataStructure.literal("JWT"),
		alg: DDataStructure.literal(config.signer.algorithm),
	});

	const decodeTokenContent = createDecodeTokenContent({
		headerStructure,
		payloadStructure,
	});

	const createToken = createTokenHandlerCreateMethod({
		config,
		headerStructure,
		payloadStructure,
	});

	return tokenHandlerKind.setTo(
		{
			create: createToken,
			decode: createTokenHandlerDecodeMethod({
				config,
				decodeTokenContent,
			}),
			verify: createTokenHandlerVerifyMethod({
				config,
				decodeTokenContent,
			}),
			async createOrThrow(payload: object, params?: object) {
				return createToken(payload, params)
					.then((value) => {
						if (DEither.isLeft(value)) {
							throw new TokenHandlerCreateError(value);
						}
						return DEither.unwrapRight(value);
					});
			},
		} satisfies Record<keyof DKind.Remove<TokenHandler>, any>,
		undefined,
	) as never;
}
