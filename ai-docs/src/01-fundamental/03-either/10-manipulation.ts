/**
 * @title Manipulation
 *
 * Il y a plusieurs outils pour manipuler les Either qui permettent de les
 * discriminer, d'effectuer des actions selon leur information, de gérer
 * des flux en faisant redescendre les erreurs, et autres outils permettant
 * de rendre la gestion de résultats le plus robuste possible.
 */
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const myResult: (
	| DEither.Success<"result">
	| DEither.Left<"fail-task", Error>
	| DEither.Fail
	| DEither.Error<Error>
);

// Il y a plusieurs façons de sélectionner un résultat :

// avec le type right or left
// "result" | DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error>
const resulWhenIsRight = DCommon.pipe(
	myResult,
	DEither.whenIsRight(
		(rightValue) => rightValue,
	),
);
// void | DEither.Success<"result"> | Error
const resulUnwrapLeft = DEither.unwrapLeft(myResult);
// Pour un résultat où l'aspect situationnel des résultats n'a pas
// d'importance, ces méthodes-là peuvent être utilisées.

// avec l'information
// DEither.Success<"result"> | DEither.Fail | DEither.Error<Error> | "test"
const resultWhenHasInformation = DCommon.pipe(
	myResult,
	DEither.whenHasInformation(
		"fail-task",
		(failTaskEither) => "test" as const,
	),
);
// "result" | Error | DEither.Fail | DEither.Error<Error>
const resultUnwrapByInformation = DCommon.pipe(
	myResult,
	DEither.unwrapByInformation(
		["success", "fail-task"],
	),
);
// Dans le cadre où l'on souhaite faire une action uniquement sur un résultat
// de manière situationnelle, ces méthodes-là permettent de les sélectionner
// par leur information.

// avec une sélection
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
		(failTaskEither) => "test" as const,
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
// Le rôle de ces méthodes-là est de créer un point d'ancrage dans le typage.
// Elles demandent de réaliser une sélection exhaustive, ce qui oblige, en cas
// d'évolution des contrat, De revenir résoudre la sélection. Utiles dans des
// cas où l'on sait en avance que la décision de traitement d'un result se fait
// cette endroit. Cela permet d'évoquer des problèmes de typage à des couches
// plus hautes, plutôt que de déléguer un résultat aux couches plus basses, qui
// pourrait causer une erreur de contrat, alors que sa résolution doit être
// faite à un autre endroit.

// Pour les fonctions "when" il existe les versions alternatives "otherwise"
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

// Pour les fonctions "unwrap", il y a une version alternative "orThrow".
// "result" | Error
const resultUnwrapByInformationOrThrow = DCommon.pipe(
	myResult,
	DEither.unwrapByInformationOrThrow(
		["success", "fail-task"],
	),
);
// Fonction très utile pour faire des insertions dans les tests unitaires.

// Il existe également une fonction match qui permet de faire un traitement
// exhaustif des résultats.
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
// La version alternative "otherwise" existe aussi.

// DEither.toMaybe permet de transformer le résultat d'une fonction qui est
// renverrée null ou undefined en monade maybe (Some<value> | None).

declare function someFunction(): string | number | null | undefined;

// DEither.None | DEither.Some<string> | DEither.Some<number>
const resultToMaybe = DEither.toMaybe(someFunction());

// DEither.rightPipe permet de gérer des résultats left en les excluant de l'étape d'après.
// Le résultat conserve leur présence, mais le pipe passera à l'étape d'après uniquement
// pour les résultats right.
// DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error>
// | DEither.Left<"wrong", undefined> | DEither.Success<string>
const resultRightPipe = DEither.rightPipe(
	myResult,
	DString.split(""),
	(value) => {
		const elementAt = DArray.at(value, 10);
		if (!elementAt) {
			return DEither.left("wrong");
		}

		return elementAt;
	},
);
// Il existe aussi la version rightAsyncPipe pour des fonctions asynchrones.

// La fonction group permet de résoudre tout un groupe de résultats ou de renvoyer
// la première erreur qu'il rencontre. Pour le coup, les opérations ne sont pas parallélisées.
// Il va "each" les clés pour résoudre les résultats. Si l'un d'entre eux renvoie quelque
// chose de négatif, il n'exécutera pas le reste.
// DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error> | DEither.Error<"errorDeLaMort">
// | DEither.Success<{
//     result1: "result";
//     result2: "mySuperResult";
//     result3: never;
// }>
const groupResult = DEither.group({
	result1: () => myResult,
	result2: DEither.success("mySuperResult"),
	result3: DEither.error("errorDeLaMort"),
});
// Il existe également la version asynchrone asyncGroup.

// hasInformation permet de discriminer dans un if un résultat.
if (DEither.hasInformation(myResult, "success")) {
	// DEither.Success<"result">
	void myResult;
}
// Il existe également les predicates pour right et left.

// safeCallback permet de sécuriser l'appel d'une fonction qui peut potentiellement émettre une erreur.
// DEither.SafeCallbackError | DEither.SafeCallbackSuccess<"test">
const resultSafeCallback = DEither.safeCallback(
	() => "test" as const,
);
// Il existe une version asynchrone safeCallback.

// keepAsRightSelection réécrit les monades pour leur réassigner left ou right selon la sélection.
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
// Il existe également une version sans sélecteur exhaustif keepAsRightByInformation.

// rewriteInformation permet de réécrire les informations portées par un résultat.
// DEither.Left<"fail", void> | DEither.Left<"error", Error> | DEither.Right<"fail-task", Error>
// | DEither.Left<"new-information", "result">
const resultRewriteInformation = DCommon.pipe(
	myResult,
	DEither.rewriteInformation({ success: "new-information" }),
);
