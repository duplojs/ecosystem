/**
 * @title DChrono.getHour
 *
 * Lire l’heure d’une date en UTC ou dans un fuseau horaire donné.
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
const hour = DChrono.getHour(date);

// La valeur obtenue est 12 en UTC.
type _CheckHour = DCommon.ExpectType<typeof hour, number, "strict">;

const inNewYork = DChrono.getHour(date, "America/New_York");
// Le résultat représente l’heure locale dans le fuseau demandé.
type _CheckTimezone = DCommon.ExpectType<typeof inNewYork, number, "strict">;

// Une date sérialisée est également acceptée, avec ou sans fuseau explicite.
const serialized = DChrono.getHour("date1609459200000+", "UTC");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

