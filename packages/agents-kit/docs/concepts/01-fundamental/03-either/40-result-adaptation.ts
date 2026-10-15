/**
 * @title Adaptation des résultats au contexte.
 *
 * Reclasser les statuts et renommer les informations en conservant les valeurs.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const myResult: (
	| DEither.Success<"result">
	| DEither.Left<"fail-task", Error>
	| DEither.Fail
	| DEither.Error<Error>
);

// Réinterpréter les statuts selon le contexte : true donne Right, false donne Left.
// L’information et la valeur sont conservées ; le sélecteur couvre toutes les variantes.
// DEither.Left<"fail", void> | DEither.Left<"error", Error> | DEither.Left<"success", "result">
// | DEither.Right<"fail-task", Error>
const resultKeepAsRightSelection = DCommon.pipe(
	myResult,
	DEither.keepAsRightSelection({
		"fail-task": true,
		error: false,
		fail: false,
		success: false,
	}),
);
// keepAsRightByInformation sélectionne seulement les informations à considérer comme Right.
// Toutes les autres deviennent Left, sans imposer de sélecteur exhaustif.
const resultByInformation = DEither.keepAsRightByInformation(myResult, "fail-task");

// Renommer une information adapte le vocabulaire du résultat au contexte appelant.
// rewriteInformation conserve le statut et la valeur ; les variantes non ciblées restent identiques.
// DEither.Fail | DEither.Error<Error> | DEither.Left<"fail-task", Error>
// | DEither.Right<"new-information", "result">
const resultRewriteInformation = DCommon.pipe(
	myResult,
	DEither.rewriteInformation({ success: "new-information" }),
);
