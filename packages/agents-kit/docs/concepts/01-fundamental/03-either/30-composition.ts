/**
 * @title Composition avec propagation des échecs.
 *
 * Enchaîner ou regrouper des opérations en arrêtant le traitement au premier Left.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

declare const myResult: (
	| DEither.Success<"result">
	| DEither.Left<"fail-task", Error>
	| DEither.Fail
	| DEither.Error<Error>
);

// `rightPipe` transmet aux étapes la valeur contenue par les Right, jamais le
// wrapper `Right` lui-même. Dès qu’un Left apparaît, les étapes suivantes sont
// ignorées et ce Left est retourné. Une valeur finale brute est enveloppée dans
// Success ; un Right final est conservé.
const resultRightPipe = DEither.rightPipe(
	myResult,
	DString.split(""),
	(value) => {
		const elementAt = DArray.at(value, 10);
		if (!elementAt) {
			return DEither.left("wrong");
		}

		return DEither.success(elementAt);
	},
	// Cette étape reçoit la string du Success retourné ci-dessus, pas son wrapper.
	DString.toUpperCase,
);
type _CheckResultRightPipe = DCommon.ExpectType<
	typeof resultRightPipe,
	DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error> | DEither.Left<"wrong", undefined> | DEither.Success<Uppercase<string>>,
	"strict"
>;
// `rightAsyncPipe` applique le même arrêt sur Left et attend chaque étape
// asynchrone. Une étape peut retourner un Either : s’il s’agit d’un Right,
// l’étape suivante reçoit encore sa valeur déballée ; s’il s’agit d’un Left,
// la suite est ignorée.
const asyncResult = DEither.rightAsyncPipe(
	Promise.resolve(myResult),
	(value) => Promise.resolve(DEither.right("normalized", value)),
	DString.toLowerCase,
);
type _CheckAsyncResult = DCommon.ExpectType<
	typeof asyncResult,
	Promise<DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error> | DEither.Success<"result">>,
	"strict"
>;
// La dernière callback retourne une string brute : `asyncResult` est donc un
// `Success<"result">`, tandis que le `Right<"normalized", ...>` intermédiaire
// n’est pas transmis comme wrapper à la callback suivante.
// Si une étape intermédiaire produit un `Result` dont une information doit être
// sélectionnée, composez sa sélection dans cette même callback avec
// `DCommon.asyncPipe`. Une étape séparée de `rightAsyncPipe` recevrait la valeur
// du `Right`, et non le `Result` qui porte l’information.

// group rassemble les valeurs des Right dans un Success, ou retourne le premier Left.
// Les getters sont appelés dans l’ordre et ceux placés après un Left ne sont pas exécutés.
// Les valeurs déjà calculées avant l’appel à group ne peuvent pas être annulées.
const groupResult = DEither.group({
	result1: () => myResult,
	result2: DEither.success("mySuperResult"),
	result3: DEither.error("errorDeLaMort"),
});
type _CheckGroupResult = DCommon.ExpectType<typeof groupResult, DEither.Left<"fail-task", Error> | DEither.Fail | DEither.Error<Error> | DEither.Error<"errorDeLaMort"> | DEither.Success<{
	result1: "result";
	result2: "mySuperResult";
	result3: never;
}>, "strict">;
// asyncGroup attend chaque résultat dans l’ordre, sans lancer les getters en parallèle.
const asyncGroupResult = DEither.asyncGroup({
	result1: () => Promise.resolve(myResult),
	result2: () => Promise.resolve(DEither.success("mySuperResult")),
});
