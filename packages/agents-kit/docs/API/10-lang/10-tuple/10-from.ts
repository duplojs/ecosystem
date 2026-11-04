/**
 * @title DTuple.from
 *
 * Interpréter les contraintes de cardinalité d’un tableau comme une forme tuple.
 */
import type * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
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

// Borne maximale seule : elle ne garantit aucune position présente.
declare const boundedValues: readonly string[] & DArray.MaxElements<4>;
const bounded = DTuple.from(boundedValues);
// La source et sa contrainte restent inchangées.
type _CheckBounded = DCommon.ExpectType<typeof bounded, readonly string[] & DArray.MaxElements<4>, "strict">;

// Combinaison : les positions minimales et la borne maximale sont conservées.
declare const rangedValues: readonly string[] & DArray.MinElements<2> & DArray.MaxElements<4>;
const ranged = DTuple.from(rangedValues);
type _CheckRanged = DCommon.ExpectType<typeof ranged, readonly [string, string, ...string[]] & DArray.MaxElements<4>, "strict">;

// Un tuple déjà précis est reconstruit à partir de son union d’éléments.
declare const pair: readonly ["name", 1];
const rebuilt = DTuple.from(pair);
// Même valeur et même référence, mais les types propres à chaque position sont perdus.
type _CheckRebuilt = DCommon.ExpectType<typeof rebuilt, readonly [1 | "name", 1 | "name"], "strict">;
