/**
 * @title Définir une politique de gestion de tokens
 *
 * `@duplojs/json-web-token` organise la gestion des tokens autour d'une politique
 * définie une seule fois avec un `tokenHandler`.
 *
 * Cette politique centralise les règles communes aux tokens : durée de vie,
 * claims attendus, structure du payload et du header, signature et éventuellement
 * chiffrement.
 *
 * Le même `tokenHandler` est ensuite réutilisé partout où ces tokens doivent
 * être créés ou vérifiés.
 */
import { Cipher, createTokenHandler, Signer } from "@duplojs/json-web-token";
import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

// Le `tokenHandler` constitue la source de vérité d'une famille de tokens.
//
// Les propriétés standard définissent les règles communes de cette politique.
// Les `DataStructure` complètent le payload et le header avec les données
// propres à l'application.
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

// La structure déclarée par le `tokenHandler` est utilisée pour typer
// et valider les données lors de la création du token.
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

// `verify` applique la même politique au token reçu.
//
// En cas de succès, le payload et le header retrouvés conservent les types
// définis par leurs `DataStructure`.
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

// La politique définit également les mécanismes de signature et de chiffrement,
// mais leur configuration n'a pas nécessairement besoin d'être fixée immédiatement.
//
// En fournissant directement un `Signer` ou un `Cipher`, ils sont prêts à être
// utilisés par toutes les opérations du `tokenHandler`.
//
// En fournissant leur factory, leur configuration est demandée au moment
// de chaque opération.
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

// `Signer` et `Cipher` sont les abstractions utilisées par cette politique
// pour encapsuler respectivement la signature et le chiffrement.
//
// La librairie fournit les implémentations courantes, mais ces abstractions
// peuvent aussi être étendues avec des mécanismes personnalisés.
//
// `Signer` et `Cipher` fournissent les mécanismes de signature et de chiffrement
// utilisés par la politique.
// La librairie fournit les implémentations courantes et permet également
// d’en définir de personnalisées lorsque nécessaire.
