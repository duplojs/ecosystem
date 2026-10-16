/**
 * @title DChrono.getFirstDayOfWeek
 *
 * Retourner le lundi de la semaine à minuit UTC.
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
const first = DChrono.getFirstDayOfWeek(date);

// La sortie représente le lundi 11 janvier 2021 à 00:00:00.000 UTC.
type _CheckFirst = DCommon.ExpectType<typeof first, DChrono.TheDate, "strict">;

// Une date sérialisée peut être utilisée comme entrée.
const serializedFirst = DChrono.getFirstDayOfWeek("date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedFirst, DChrono.TheDate, "strict">;

