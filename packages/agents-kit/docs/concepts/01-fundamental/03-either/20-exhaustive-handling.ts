/**
 * @title Décisions exhaustives sur les résultats.
 *
 * Sélection et traitement de chaque variante pour détecter les évolutions du contrat.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const myResult: (
	| DEither.Success<"result">
	| DEither.Left<"fail-task", Error>
	| DEither.Fail
	| DEither.Error<Error>
);

// Sélectionner plusieurs variantes avec une décision explicite pour chacune.
const resultWhenIsSelected = DCommon.pipe(
	myResult,
	DEither.whenIsSelected(
		{
			"fail-task": false,
			error: true,
			fail: false,
			success: true,
		},
		(value) => "test" as const,
	),
);
type _CheckResultWhenIsSelected = DCommon.ExpectType<
	typeof resultWhenIsSelected,
	DEither.Left<"fail-task", Error> | DEither.Fail | "test",
	"strict"
>;
const resultUnwrapSelection = DCommon.pipe(
	myResult,
	DEither.unwrapSelection(
		{
			"fail-task": false,
			error: true,
			fail: false,
			success: false,
		},
	),
);
type _CheckResultUnwrapSelection = DCommon.ExpectType<
	typeof resultUnwrapSelection,
	DEither.Success<"result"> | Error | DEither.Left<"fail-task", Error> | DEither.Fail,
	"strict"
>;
// Chaque information doit apparaître dans le sélecteur, même lorsqu’elle vaut false.
// Ajouter une variante au contrat oblige à réviser la sélection à cet endroit.
// Cela place la décision dans la couche qui doit la prendre, plutôt que de transmettre
// involontairement un nouveau résultat à une couche qui ne sait pas le traiter.

// matchInformation impose une callback pour chaque information.
// Chaque callback reçoit la valeur contenue dans la variante correspondante.
// "fail-task" | "success" | "fail" | "error"
const resultMatchInformation = DCommon.pipe(
	myResult,
	DEither.matchInformation(
		{
			"fail-task": (value) => {
				type _CheckFailTaskValue = DCommon.ExpectType<typeof value, Error, "strict">;
				return "fail-task" as const;
			},
			error: (value) => {
				type _CheckErrorValue = DCommon.ExpectType<typeof value, Error, "strict">;
				return "error" as const;
			},
			fail: (value) => {
				type _CheckFailValue = DCommon.ExpectType<typeof value, void, "strict">;
				return "fail" as const;
			},
			success: (value) => {
				type _CheckSuccessValue = DCommon.ExpectType<typeof value, "result", "strict">;
				return "success" as const;
			},
		},
	),
);
type _CheckResultMatchInformation = DCommon.ExpectType<typeof resultMatchInformation, "fail-task" | "success" | "fail" | "error", "strict">;
// matchInformationOtherwise autorise un traitement partiel avec une branche de repli.
const resultWithFallback = DCommon.pipe(
	myResult,
	DEither.matchInformationOtherwise(
		{ success: (value) => value },
		(otherResult) => "unhandled" as const,
	),
);
// Les fonctions whenIsSelected disposent aussi d’une variante Otherwise.
