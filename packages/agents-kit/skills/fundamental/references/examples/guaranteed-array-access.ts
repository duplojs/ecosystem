/**
 * @title Exploiter une taille minimale de tableau.
 *
 * Distinguer les indices garantis et les accès potentiellement absents.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

const namesStructure = DDataStructure.array(
	DDataStructure.string(),
	[DDataStructure.minElements(2)],
);

declare const input: unknown;
const result = namesStructure.check(input);
if (DEither.isRight(result)) {
	const names = DEither.unwrapRight(result);
	const first = DArray.first(names);
	const last = DArray.last(names);
	const atZero = DArray.at(names, 0);
	const atOne = DArray.at(names, 1);
	const atTwo = DArray.at(names, 2);

	type _CheckAccess = DCommon.ExpectType<
		[typeof first, typeof last, typeof atZero, typeof atOne, typeof atTwo],
		[string, string, string, string, string | undefined],
		"strict"
	>;
}
