/**
 * @title DChrono.minTime
 *
 * Retourner la durée de valeur minimale parmi plusieurs durées.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const shortest = DChrono.minTime([
	DChrono.createTimeOrThrow(1_000),
	DChrono.createTimeOrThrow(2_000),
] as const);

// La valeur obtenue représente 1 000 millisecondes.
type _CheckShortest = DCommon.ExpectType<typeof shortest, DChrono.TheTime, "strict">;

// Les éléments peuvent être un mélange de TheTime et de durées sérialisées.
const shortestMixed = DChrono.minTime([
	"time1000+",
	DChrono.createTimeOrThrow(2_000),
] as const);
type _CheckMixed = DCommon.ExpectType<typeof shortestMixed, DChrono.TheTime, "strict">;

