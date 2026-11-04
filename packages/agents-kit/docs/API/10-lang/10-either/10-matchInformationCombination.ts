/**
 * @title DEither.matchInformationCombination
 *
 * Appliquer un traitement pour chaque combinaison d’informations d’une collection d’Either.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

type Combination = readonly [
	DEither.Success<42> | DEither.Error<"message">,
	DEither.Right<"found", 1> | DEither.Left<"missing", undefined>,
];

declare const combination: Combination;

// Appel classique : les quatre combinaisons possibles sont traitées explicitement.
const direct = DEither.matchInformationCombination(combination, {
	"success/found": (values) => {
		type _CheckValues = DCommon.ExpectType<typeof values, readonly [42, 1], "strict">;
		return values;
	},
	"success/missing": (values) => {
		type _CheckValues = DCommon.ExpectType<typeof values, readonly [42, undefined], "strict">;
		return values;
	},
	"error/found": (values) => {
		type _CheckValues = DCommon.ExpectType<typeof values, readonly ["message", 1], "strict">;
		return values;
	},
	"error/missing": (values) => {
		type _CheckValues = DCommon.ExpectType<typeof values, readonly ["message", undefined], "strict">;
		return values;
	},
});
type _CheckDirect = DCommon.ExpectType<
	typeof direct,
	| readonly [42, 1]
	| readonly [42, undefined]
	| readonly ["message", 1]
	| readonly ["message", undefined],
	"strict"
>;

// Appel curifié : le matcher exhaustif est directement placé dans le pipe.
const piped = DCommon.pipe(
	combination,
	DEither.matchInformationCombination({
		"success/found": (values) => values,
		"success/missing": (values) => values,
		"error/found": (values) => values,
		"error/missing": (values) => values,
	}),
);
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	| readonly [42, 1]
	| readonly [42, undefined]
	| readonly ["message", 1]
	| readonly ["message", undefined],
	"strict"
>;
