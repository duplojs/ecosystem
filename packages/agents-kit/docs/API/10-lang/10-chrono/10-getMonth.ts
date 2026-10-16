/**
 * @title DChrono.getMonth
 *
 * Lire le mois d’une date, de 1 à 12, en UTC ou dans un fuseau donné.
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
const month = DChrono.getMonth(date);

// La valeur obtenue est 1.
type _CheckMonth = DCommon.ExpectType<typeof month, number, "strict">;

const inNewYork = DChrono.getMonth(date, "America/New_York");
type _CheckTimezone = DCommon.ExpectType<typeof inNewYork, number, "strict">;

// Une date sérialisée est également acceptée.
const serialized = DChrono.getMonth("date1609459200000+", "UTC");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

