/**
 * @title Discrimination et extraction des résultats.
 *
 * Choisir une branche par statut ou information, extraire sa valeur et traiter les autres cas.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const myResult: (
	| DEither.Success<"result">
	| DEither.Left<"fail-task", Error>
	| DEither.Fail
	| DEither.Error<Error>
);

// Choisir Right ou Left lorsque seul le statut du résultat compte.
// whenIsRight transforme la valeur contenue dans un Right et transmet les Left tels quels.
// "result" | DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error>
const resultWhenIsRight = DCommon.pipe(
	myResult,
	DEither.whenIsRight(
		(rightValue) => rightValue,
	),
);
// void | DEither.Success<"result"> | Error
const resultUnwrapLeft = DEither.unwrapLeft(myResult);
// unwrapLeft extrait la valeur des Left et conserve les autres résultats enveloppés.

// Choisir une information lorsque le cas précis compte, quel que soit son statut.
// La callback reçoit ici l’Error contenue dans le Left "fail-task".
// DEither.Success<"result"> | DEither.Fail | DEither.Error<Error> | "test"
const resultWhenHasInformation = DCommon.pipe(
	myResult,
	DEither.whenHasInformation(
		"fail-task",
		(error) => "test" as const,
	),
);
// "result" | Error | DEither.Fail | DEither.Error<Error>
const resultUnwrapByInformation = DCommon.pipe(
	myResult,
	DEither.unwrapByInformation(
		["success", "fail-task"],
	),
);
// Les variantes non ciblées sont conservées dans le résultat et dans son type.

// Les variantes Otherwise traitent aussi les cas non ciblés, au lieu de les transmettre.
// "right" | "left"
const resultWhenIsRightOtherwise = DCommon.pipe(
	myResult,
	DEither.whenIsRightOtherwise(
		// "result"
		(rightValue) => "right" as const,
		// DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error>
		(leftResult) => "left" as const,
	),
);

// Les variantes OrThrow extraient les cas ciblés et lèvent une exception pour les autres.
// "result" | Error
const resultUnwrapByInformationOrThrow = DCommon.pipe(
	myResult,
	DEither.unwrapByInformationOrThrow(
		["success", "fail-task"],
	),
);
// Utile notamment pour affirmer le résultat attendu dans un test unitaire.

// Les predicates réduisent le type dans une branche conditionnelle.
if (DEither.hasInformation(myResult, "success")) {
	// DEither.Success<"result">
	void myResult;
}
// isRight et isLeft réduisent aussi le type selon le statut du résultat.
if (DEither.isLeft(myResult)) {
	// Error | void
	const leftValue = DEither.unwrapLeft(myResult);
}
