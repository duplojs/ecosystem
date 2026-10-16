/**
 * @title DChrono.getSecond
 *
 * Lire les secondes d’une date en UTC ou dans un fuseau horaire donné.
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
const second = DChrono.getSecond(date);

// La valeur obtenue est 56 en UTC.
type _CheckSecond = DCommon.ExpectType<typeof second, number, "strict">;

const inNewYork = DChrono.getSecond(date, "America/New_York");
type _CheckTimezone = DCommon.ExpectType<typeof inNewYork, number, "strict">;

// Une date sérialisée est également acceptée.
const serialized = DChrono.getSecond("date1609459200000+", "UTC");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

