/**
 * @title DChrono.getYear
 *
 * Lire l’année d’une date en UTC ou dans un fuseau horaire donné.
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
const year = DChrono.getYear(date);

// La valeur obtenue est 2021.
type _CheckYear = DCommon.ExpectType<typeof year, number, "strict">;

const inNewYork = DChrono.getYear(date, "America/New_York");
type _CheckTimezone = DCommon.ExpectType<typeof inNewYork, number, "strict">;

// Une date sérialisée est également acceptée.
const serialized = DChrono.getYear("date1609459200000+", "UTC");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

