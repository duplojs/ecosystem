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
const resultWhenIsRight = DCommon.pipe(
	myResult,
	DEither.whenIsRight(
		(rightValue) => rightValue,
	),
);
type _CheckResultWhenIsRight = DCommon.ExpectType<
	typeof resultWhenIsRight,
	"result" | DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error>,
	"strict"
>;
const resultUnwrapLeft = DEither.unwrapLeft(myResult);
// unwrapLeft extrait la valeur des Left et conserve les autres résultats enveloppés.

// Choisir une information lorsque le cas précis compte, quel que soit son statut.
// La callback reçoit ici l’Error contenue dans le Left "fail-task".
const resultWhenHasInformation = DCommon.pipe(
	myResult,
	DEither.whenHasInformation(
		"fail-task",
		(error) => "test" as const,
	),
);
type _CheckResultWhenHasInformation = DCommon.ExpectType<
	typeof resultWhenHasInformation,
	DEither.Success<"result"> | DEither.Fail | DEither.Error<Error> | "test",
	"strict"
>;
const resultUnwrapByInformation = DCommon.pipe(
	myResult,
	DEither.unwrapByInformation(
		["success", "fail-task"],
	),
);
type _CheckResultUnwrapByInformation = DCommon.ExpectType<typeof resultUnwrapByInformation, "result" | Error | DEither.Fail | DEither.Error<Error>, "strict">;
// Les variantes non ciblées sont conservées dans le résultat et dans son type.

// Les variantes Otherwise traitent aussi les cas non ciblés, au lieu de les transmettre.
const resultWhenIsRightOtherwise = DCommon.pipe(
	myResult,
	DEither.whenIsRightOtherwise(
		(rightValue) => {
			type _CheckRightValue = DCommon.ExpectType<typeof rightValue, "result", "strict">;
			return "right" as const;
		},
		(leftResult) => {
			type _CheckLeftResult = DCommon.ExpectType<typeof leftResult, DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error>, "strict">;
			return "left" as const;
		},
	),
);
type _CheckResultWhenIsRightOtherwise = DCommon.ExpectType<typeof resultWhenIsRightOtherwise, "right" | "left", "strict">;

// Les variantes OrThrow extraient les cas ciblés et lèvent une exception pour les autres.
const resultUnwrapByInformationOrThrow = DCommon.pipe(
	myResult,
	DEither.unwrapByInformationOrThrow(
		["success", "fail-task"],
	),
);
type _CheckResultUnwrapByInformationOrThrow = DCommon.ExpectType<typeof resultUnwrapByInformationOrThrow, "result" | Error, "strict">;
// Utile notamment pour affirmer le résultat attendu dans un test unitaire.

// Les predicates réduisent le type dans une branche conditionnelle.
if (DEither.hasInformation(myResult, "success")) {
	type _CheckSuccessResult = DCommon.ExpectType<typeof myResult, DEither.Success<"result">, "strict">;
	void myResult;
}
// isRight et isLeft réduisent aussi le type selon le statut du résultat.
if (DEither.isLeft(myResult)) {
	const leftValue = DEither.unwrapLeft(myResult);
	void leftValue;
}
