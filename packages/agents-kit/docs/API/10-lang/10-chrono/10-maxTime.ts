/**
 * @title DChrono.maxTime
 *
 * Retourner la durée de valeur maximale parmi plusieurs durées.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const longest = DChrono.maxTime([
	DChrono.createTimeOrThrow(1_000),
	DChrono.createTimeOrThrow(2_000),
] as const);

// La valeur obtenue représente 2 000 millisecondes.
type _CheckLongest = DCommon.ExpectType<typeof longest, DChrono.TheTime, "strict">;

// Les éléments peuvent être un mélange de TheTime et de durées sérialisées.
const longestMixed = DChrono.maxTime([
	"time1000+",
	DChrono.createTimeOrThrow(2_000),
] as const);
type _CheckMixed = DCommon.ExpectType<typeof longestMixed, DChrono.TheTime, "strict">;

