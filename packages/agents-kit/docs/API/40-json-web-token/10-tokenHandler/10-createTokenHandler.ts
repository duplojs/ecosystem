/**
 * @title createTokenHandler
 *
 * Construire une politique JWT typée et réutilisable.
 */
import { Cipher, createTokenHandler, Signer } from "@duplojs/json-web-token";
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

// Secret fourni par l'environnement ; choisir une clé adaptée à la production.
declare const secret: string;

const sessions = createTokenHandler({
	maxAge: DChrono.createTime(15, "minute"),
	issuer: "application",
	audience: "api",
	subject: "session",

	signer: Signer.createHS256({
		secret,
	}),

	customPayloadShape: {
		userId: DDataStructure.string(),
		role: DDataStructure.literal("admin"),
	},
	customHeaderShape: {
		kid: DDataStructure.string(),
	},
});

const creation = await sessions.create(
	{
		userId: "42",
		role: "admin",
	},
	{
		header: {
			kid: "current",
		},
	},
);

if (DEither.isRight(creation)) {
	const token = DEither.unwrapRight(creation);
	const verification = await sessions.verify(token);

	if (DEither.isRight(verification)) {
		// La signature et les contrôles de politique ont réussi.
		const { header, payload } = DEither.unwrapRight(verification);
		const userId = payload.userId;

		type _Role = DCommon.ExpectType<
			typeof payload.role,
			"admin",
			"strict"
		>;
		type _Algorithm = DCommon.ExpectType<
			typeof header.alg,
			"HS256",
			"strict"
		>;
		type _KeyId = DCommon.ExpectType<
			typeof header.kid,
			string,
			"strict"
		>;
	}
	// Un Left identifie le refus : signature-invalid, expired ou autre motif.

	// decode valide les structures, mais pas la signature ni la politique.
	// Son résultat typé ne prouve donc pas l'identité de l'émetteur.
	const decoded = await sessions.decode(token);
	if (DEither.isRight(decoded)) {
		// La structure est validée, sans authentifier ces données.
		const decodedPayload = DEither.unwrapRight(decoded).payload;
	}
}

// create renvoie notamment des Left d'encodage ; verify peut aussi renvoyer
// signature-invalid, issue-invalid, subject-invalid, audience-invalid ou expired.
// createOrThrow renvoie directement le token ou lève TokenHandlerCreateError.
const token = await sessions.createOrThrow(
	{
		userId: "42",
		role: "admin",
	},
	{
		header: {
			kid: "current",
		},
	},
);

// Une factory reporte la configuration du signer à chaque opération concernée.
const dynamicSessions = createTokenHandler({
	maxAge: DChrono.createTime(15, "minute"),
	signer: Signer.createHS256,
	customPayloadShape: {
		userId: DDataStructure.string(),
	},
});

const dynamicCreation = await dynamicSessions.create(
	{ userId: "42" },
	{ signer: { secret } },
);
if (DEither.isRight(dynamicCreation)) {
	const dynamicToken = DEither.unwrapRight(dynamicCreation);
	// Either : token vérifié ou motif de refus.
	const verification = await dynamicSessions.verify(
		dynamicToken,
		{ signer: { secret } },
	);
}

// Les shapes valident des champs, sans enregistrer de règles de politique personnalisées.
// Un cipher facultatif chiffre le token entier ; decode et verify le déchiffrent.
// Avec une factory de chiffrement, seules les opérations concernées reçoivent
// ses clés : decode ne requiert pas de paramètres de signature.
// RSA-OAEP limite la taille du texte chiffrable selon la clé et le hash :
// vérifier que le token signé tient dans cette limite avant de choisir ce cipher.
declare const privateKey: string;
declare const publicKey: string;

const encryptedSessions = createTokenHandler({
	maxAge: DChrono.createTime(15, "minute"),
	signer: Signer.createHS256({
		secret,
	}),
	cipher: Cipher.createRSAOAEP256,
	customPayloadShape: {
		userId: DDataStructure.string(),
	},
});

const encryptedCreation = await encryptedSessions.create(
	{ userId: "42" },
	{
		cipher: {
			privateKey,
			publicKey,
		},
	},
);
if (DEither.isRight(encryptedCreation)) {
	const encryptedToken = DEither.unwrapRight(encryptedCreation);
	// Either contenant les données décodées ou un refus de structure.
	const decoded = await encryptedSessions.decode(
		encryptedToken,
		{
			cipher: {
				privateKey,
				publicKey,
			},
		},
	);
}
