/**
 * @title DChrono.minTime
 *
 * Retourner la durée de valeur minimale parmi plusieurs durées.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

declare const times: [DChrono.TheTime, DChrono.TheTime];
const shortest = DChrono.minTime(times);

// La valeur obtenue représente 1 000 millisecondes.
type _CheckShortest = DCommon.ExpectType<typeof shortest, DChrono.TheTime, "strict">;

// Les éléments peuvent être un mélange de TheTime et de durées sérialisées.
declare const mixedTimes: [DChrono.TheTime | DChrono.SerializedTheTime, DChrono.TheTime | DChrono.SerializedTheTime];
const shortestMixed = DChrono.minTime(mixedTimes);
type _CheckMixed = DCommon.ExpectType<typeof shortestMixed, DChrono.TheTime, "strict">;

