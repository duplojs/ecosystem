/**
 * @title DChrono.maxTime
 *
 * Retourner la durée de valeur maximale parmi plusieurs durées.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

declare const times: [DChrono.TheTime, DChrono.TheTime];
const longest = DChrono.maxTime(times);

// La valeur obtenue représente 2 000 millisecondes.
type _CheckLongest = DCommon.ExpectType<typeof longest, DChrono.TheTime, "strict">;

// Les éléments peuvent être un mélange de TheTime et de durées sérialisées.
declare const mixedTimes: [DChrono.TheTime | DChrono.SerializedTheTime, DChrono.TheTime | DChrono.SerializedTheTime];
const longestMixed = DChrono.maxTime(mixedTimes);
type _CheckMixed = DCommon.ExpectType<typeof longestMixed, DChrono.TheTime, "strict">;

