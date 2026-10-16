/**
 * @title DChrono.getDayOfYear
 *
 * Lire le numéro du jour dans l’année, en tenant compte du fuseau choisi.
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
const day = DChrono.getDayOfYear(date);

// La valeur obtenue est 15.
type _CheckDay = DCommon.ExpectType<typeof day, number, "strict">;

// Un fuseau explicite peut faire basculer la date vers un autre jour de l’année.
const inNewYork = DChrono.getDayOfYear(date, "America/New_York");
type _CheckTimezone = DCommon.ExpectType<typeof inNewYork, number, "strict">;

// La surcharge accepte aussi une date sérialisée.
const serialized = DChrono.getDayOfYear("date1609459200000+", "UTC");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

