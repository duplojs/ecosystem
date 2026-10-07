/**
 * @title Définir une politique de gestion de tokens
 *
 * Déclaration d'une politique unique pour créer et vérifier une famille de tokens.
 */
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
// | Right<"token-created", string>
// | Left<"header-encode-error", Error>
// | Left<"payload-encode-error", Error>;
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

if (DEither.isRight(createdTokenResult)) {
	// string
	const token = DEither.unwrapRight(createdTokenResult);
}

// `verify` applique la même politique et restitue header/payload typés.
// | Left<"token-format", unknown>
// | Left<"header-json-error", unknown>
// | Left<"header-decode-error", Error>
// | Left<"payload-json-error", unknown>
// | Left<"payload-decode-error", Error>
// | Left<"signature-invalid", unknown>
// | Left<"issue-invalid", unknown>
// | Left<"subject-invalid", unknown>
// | Left<"audience-invalid", unknown>
// | Left<"expired", unknown>
// | Right<
//  "token-verified",
//  {
//    readonly header: {
//      readonly typ: "JWT";
//      readonly alg: "HS256";
//      readonly kid?: string | undefined;
//    };
//    readonly payload: {
//      readonly iss: string;
//      readonly sub: undefined;
//      readonly aud: string;
//      readonly exp: number;
//      readonly iat: number;
//      readonly userId: string;
//      readonly role: "admin";
//    };
//  }
// >;
const verifiedTokenResult = await tokenHandler.verify("receive-token");

if (DEither.isRight(verifiedTokenResult)) {
	const { payload, header } = DEither.unwrapRight(verifiedTokenResult);

	const userId = payload.userId;
	const role = payload.role;
	const kid = header.kid;
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
