/**
 * @title DArray.group
 *
 * Regrouper les valeurs produites par une fonction selon un nom de groupe.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// Chaque valeur est affectée à un groupe avec groupOutput via le paramètre output.
const result = DArray.group(numbers, (value, { output }) => output(
	value % 2 === 0 ? "even" : "odd",
	value,
));

// Les groupes présents contiennent des tuples non vides de leurs valeurs.
type _CheckEven = DCommon.ExpectType<
	typeof result.even,
	readonly [number, ...number[]] | undefined,
	"strict"
>;
type _CheckOdd = DCommon.ExpectType<
	typeof result.odd,
	readonly [number, ...number[]] | undefined,
	"strict"
>;
