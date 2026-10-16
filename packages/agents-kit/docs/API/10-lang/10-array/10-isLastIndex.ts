/**
 * @title DArray.isLastIndex
 *
 * Vérifier qu’un index désigne le dernier élément du tableau.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const values = ["a", "b", "c"];

// Appel classique : l’index 2 est le dernier index de values.
const result = DArray.isLastIndex(values, 2);

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : l’index est fourni dans l’étape du pipe.
const piped = DCommon.pipe(
	values,
	DArray.isLastIndex(1),
);

// La valeur obtenue est false.
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
