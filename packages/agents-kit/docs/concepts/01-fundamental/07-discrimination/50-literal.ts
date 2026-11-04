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

const matchedStatus = DPattern.matchWithString(
	status,
	{
		pending: () => "wait" as const,

		ready: () => "run" as const,

		failed: () => "error" as const,
	},
);
type _CheckMatchedStatusLine20 = DCommon.ExpectType<
	typeof matchedStatus,
	"wait" | "run" | "error",
	"strict"
>;

// La forme curried peut être utilisée directement dans un pipe.

const matchedStatusInPipe = DCommon.pipe(
	status,
	DPattern.matchWithString({
		pending: () => "wait" as const,
		ready: () => "run" as const,
		failed: () => "error" as const,
	}),
);
type _CheckMatchedStatusInPipeLine37 = DCommon.ExpectType<
	typeof matchedStatusInPipe,
	"wait" | "run" | "error",
	"strict"
>;

// La variante `otherwise` permet de ne sélectionner qu'une partie de l'union.
//
// Le callback `otherwise` reçoit précisément les literals non traités.

const matchedStatusOtherwise = DPattern.matchWithStringOtherwise(
	status,
	{
		ready: () => "run" as const,
	},
	(otherStatus) => {
		type _CheckOtherwiseStatus = DCommon.ExpectType<typeof otherStatus, "pending" | "failed", "strict">;
		return "not-ready" as const;
	},
);
type _CheckMatchedStatusOtherwiseLine51 = DCommon.ExpectType<
	typeof matchedStatusOtherwise,
	"run" | "not-ready",
	"strict"
>;

declare const code: 200 | 404 | 500;

// `matchWithNumber` applique le même principe aux unions de number literals.

const matchedCode = DPattern.matchWithNumber(
	code,
	{
		200: () => "success" as const,
		404: () => "not-found" as const,
		500: () => "error" as const,
	},
);
type _CheckMatchedCodeLine65 = DCommon.ExpectType<
	typeof matchedCode,
	"success" | "not-found" | "error",
	"strict"
>;

// `matchWithNumberOtherwise` permet également une sélection partielle.

const matchedCodeOtherwise = DPattern.matchWithNumberOtherwise(
	code,
	{
		200: () => "success" as const,
	},
	// 404 | 500
	() => "error" as const,
);
type _CheckMatchedCodeOtherwiseLine77 = DCommon.ExpectType<
	typeof matchedCodeOtherwise,
	"success" | "error",
	"strict"
>;

// Un matcher exhaustif doit couvrir chaque valeur possible et refuse les clés étrangères à l’union.
// Ajouter une valeur au contrat impose de réviser les branches, contrairement à une sélection partielle.
