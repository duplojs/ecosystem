/**
 * @title Définir une politique de gestion de tokens
 *
 * Déclaration d'une politique unique pour créer et vérifier une famille de tokens.
 */
import type * as DCommon from "@duplojs/lang/common";
import { Cipher, createTokenHandler, Signer } from "@duplojs/json-web-token";
import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

// Le `tokenHandler` est la source de vérité d'une famille de tokens :
// propriétés standard, payload/header applicatifs, signature et chiffrement.
const tokenHandler = createTokenHandler({
	maxAge: DChrono.createTime(15, "minute"),
	issuer: "my-application",
	audience: "my-api",

	signer: Signer.createHS256({
		secret: "my-secret",
	}),

	customPayloadShape: {
		userId: DDataStructure.string(),
		role: DDataStructure.literal("admin"),
	},

	customHeaderShape: {
		kid: DDataStructure.optional(
			DDataStructure.string(),
		),
	},
});

// À la création, les structures du handler typent et valident header/payload.
const createdTokenResult = await tokenHandler.create(
	{
		userId: "42",
		role: "admin",
	},
	{
		header: {
			kid: "main",
		},
	},
);
type _CheckCreatedTokenResult = DCommon.ExpectType<
	typeof createdTokenResult,
	DEither.Right<"token-created", string> | DEither.Left<"header-encode-error", DDataStructure.Error> | DEither.Left<"payload-encode-error", DDataStructure.Error>,
	"strict"
>;

if (DEither.isRight(createdTokenResult)) {
	const token = DEither.unwrapRight(createdTokenResult);
	type _CheckToken = DCommon.ExpectType<typeof token, string, "strict">;
}

// `verify` applique la même politique et restitue header/payload typés.
const verifiedTokenResult = await tokenHandler.verify("receive-token");
type _CheckVerifiedTokenResult = DCommon.ExpectType<typeof verifiedTokenResult,
	DEither.Left<"token-format", unknown> | DEither.Left<"header-json-error", unknown> | DEither.Left<"header-decode-error", DDataStructure.Error> | DEither.Left<"payload-json-error", unknown> | DEither.Left<"payload-decode-error", DDataStructure.Error> | DEither.Left<"signature-invalid", unknown> | DEither.Left<"issue-invalid", unknown> | DEither.Left<"subject-invalid", unknown> | DEither.Left<"audience-invalid", unknown> | DEither.Left<"expired", unknown> | DEither.Right<"token-verified", {
		readonly header: {
			readonly typ: "JWT";
			readonly alg: "HS256";
			readonly kid?: string | undefined;
		};
		readonly payload: {
			readonly iss: string;
			readonly sub: undefined;
			readonly aud: string;
			readonly exp: number;
			readonly iat: number;
			readonly userId: string;
			readonly role: "admin";
		};
	}>,
	"strict"
>;

if (DEither.isRight(verifiedTokenResult)) {
	const verifiedToken = DEither.unwrapRight(verifiedTokenResult);
	type _CheckVerifiedToken = DCommon.ExpectType<typeof verifiedToken, {
		readonly header: {
			readonly typ: "JWT";
			readonly alg: "HS256";
			readonly kid?: string | undefined;
		};
		readonly payload: {
			readonly iss: string;
			readonly sub: undefined;
			readonly aud: string;
			readonly exp: number;
			readonly iat: number;
			readonly userId: string;
			readonly role: "admin";
		};
	}, "strict">;

	const userId = verifiedToken.payload.userId;
	const role = verifiedToken.payload.role;
	const kid = verifiedToken.header.kid;
	type _CheckUserId = DCommon.ExpectType<typeof userId, string, "strict">;
	type _CheckRole = DCommon.ExpectType<typeof role, "admin", "strict">;
	type _CheckKid = DCommon.ExpectType<typeof kid, string | undefined, "strict">;
}

// Avec une factory de `Signer` ou `Cipher`, la configuration est fournie
// au moment de chaque opération.
const dynamicTokenHandler = createTokenHandler({
	maxAge: DChrono.createTime(15, "minute"),

	signer: Signer.createHS256,
	cipher: Cipher.createRSAOAEP,

	customPayloadShape: {
		userId: DDataStructure.string(),
	},
});

const dynamicTokenResult = await dynamicTokenHandler.create(
	{
		userId: "42",
	},
	{
		signer: {
			secret: "my-secret",
		},
		cipher: {
			privateKey: "private-key",
			publicKey: "public-key",
		},
	},
);

const dynamicVerifiedTokenResult = await dynamicTokenHandler.verify(
	"receive-token",
	{
		signer: {
			secret: "my-secret",
		},
		cipher: {
			privateKey: "private-key",
			publicKey: "public-key",
		},
	},
);

// `Signer` et `Cipher` encapsulent signature et chiffrement.
// Les implémentations fournies peuvent être remplacées par des mécanismes personnalisés.
