/**
 * @title DTuple.from
 *
 * Interpréter les contraintes de cardinalité d’un tableau comme une forme tuple.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DTuple from "@duplojs/lang/tuple";

// Sans contrainte de cardinalité, la source reste un tableau de longueur inconnue.
declare const values: readonly string[];
const array = DTuple.from(values);
type _CheckArray = DCommon.ExpectType<typeof array, readonly string[], "strict">;

// Une longueur exacte établit le nombre de positions du tuple.
declare const fixedValues: readonly string[] & DArray.LengthEqual<3>;
const fixedTuple = DTuple.from(fixedValues);
type _CheckFixedTuple = DCommon.ExpectType<
	typeof fixedTuple,
	readonly [string, string, string],
	"strict"
>;

// Un minimum d’éléments garantit les premières positions et laisse la suite variable.
declare const nonEmptyValues: readonly string[] & DArray.MinElements<2>;
const nonEmptyTuple = DTuple.from(nonEmptyValues);
type _CheckNonEmptyTuple = DCommon.ExpectType<
	typeof nonEmptyTuple,
	readonly [string, string, ...string[]],
	"strict"
>;

// Ces conversions sont statiques : à l’exécution, from renvoie la même source.
