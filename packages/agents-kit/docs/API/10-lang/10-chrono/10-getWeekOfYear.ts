/**
 * @title DChrono.getWeekOfYear
 *
 * Lire le numéro ISO de la semaine d’une date, en tenant compte du fuseau choisi.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDateOrThrow({
	value: "2021-01-15",
	hour: 12,
	minute: 34,
	second: 56,
	millisecond: 789,
});
const week = DChrono.getWeekOfYear(date);

// La valeur obtenue est 2 pour le 15 janvier 2021.
type _CheckWeek = DCommon.ExpectType<typeof week, number, "strict">;

const inNewYork = DChrono.getWeekOfYear(date, "America/New_York");
type _CheckTimezone = DCommon.ExpectType<typeof inNewYork, number, "strict">;

// Une date sérialisée est également acceptée.
const serialized = DChrono.getWeekOfYear("date1609459200000+", "UTC");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

