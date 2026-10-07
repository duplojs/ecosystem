/**
 * @title Discrimination des valeurs littérales.
 *
 * Traitement exhaustif ou partiel d’une union selon la valeur, avec branches typées.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";

// Pour une union de valeurs littérales, privilégier les matchers dédiés aux string ou number.
// Ils sélectionnent directement la valeur et affinent le type reçu dans chaque branche.

declare const status: "pending" | "ready" | "failed";

// `matchWithString` discrimine exhaustivement une union de string literals.
//
// Chaque valeur possible doit posséder un handler et chaque callback reçoit
// précisément le literal correspondant.

// "wait" | "run" | "error"
const matchedStatus = DPattern.matchWithString(
	status,
	{
		// "pending"
		pending: () => "wait" as const,

		// "ready"
		ready: () => "run" as const,

		// "failed"
		failed: () => "error" as const,
	},
);

// La forme curried peut être utilisée directement dans un pipe.

// "wait" | "run" | "error"
const matchedStatusInPipe = DCommon.pipe(
	status,
	DPattern.matchWithString({
		pending: () => "wait" as const,
		ready: () => "run" as const,
		failed: () => "error" as const,
	}),
);

// La variante `otherwise` permet de ne sélectionner qu'une partie de l'union.
//
// Le callback `otherwise` reçoit précisément les literals non traités.

// "run" | "not-ready"
const matchedStatusOtherwise = DPattern.matchWithStringOtherwise(
	status,
	{
		ready: () => "run" as const,
	},
	// "pending" | "failed"
	() => "not-ready" as const,
);

declare const code: 200 | 404 | 500;

// `matchWithNumber` applique le même principe aux unions de number literals.

// "success" | "not-found" | "error"
const matchedCode = DPattern.matchWithNumber(
	code,
	{
		200: () => "success" as const,
		404: () => "not-found" as const,
		500: () => "error" as const,
	},
);

// `matchWithNumberOtherwise` permet également une sélection partielle.

// "success" | "error"
const matchedCodeOtherwise = DPattern.matchWithNumberOtherwise(
	code,
	{
		200: () => "success" as const,
	},
	// 404 | 500
	() => "error" as const,
);

// Un matcher exhaustif doit couvrir chaque valeur possible et refuse les clés étrangères à l’union.
// Ajouter une valeur au contrat impose de réviser les branches, contrairement à une sélection partielle.
