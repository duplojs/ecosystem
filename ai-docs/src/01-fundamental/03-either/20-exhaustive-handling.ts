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
// DEither.Left<"fail-task", Error> | DEither.Fail | "test"
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
// DEither.Success<"result"> | Error | DEither.Left<"fail-task", Error> | DEither.Fail
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
			// Error
			"fail-task": (value) => "fail-task" as const,
			// Error
			error: (value) => "error" as const,
			// void
			fail: (value) => "fail" as const,
			// "result"
			success: (value) => "success" as const,
		},
	),
);
// matchInformationOtherwise autorise un traitement partiel avec une branche de repli.
const resultWithFallback = DCommon.pipe(
	myResult,
	DEither.matchInformationOtherwise(
		{ success: (value) => value },
		(otherResult) => "unhandled" as const,
	),
);
// Les fonctions whenIsSelected disposent aussi d’une variante Otherwise.
