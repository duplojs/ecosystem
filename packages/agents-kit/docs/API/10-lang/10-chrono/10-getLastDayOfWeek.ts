/**
 * @title DChrono.getLastDayOfWeek
 *
 * Retourner le dimanche de la semaine à 23:59:59.999 UTC.
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
const last = DChrono.getLastDayOfWeek(date);

// La sortie représente le dimanche 17 janvier 2021 à 23:59:59.999 UTC.
type _CheckLast = DCommon.ExpectType<typeof last, DChrono.TheDate, "strict">;

// Une date sérialisée peut être utilisée comme entrée.
const serializedLast = DChrono.getLastDayOfWeek("date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedLast, DChrono.TheDate, "strict">;

