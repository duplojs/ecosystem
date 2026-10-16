/**
 * @title DChrono.getFirstDayOfMonth
 *
 * Retourner le premier jour du mois à minuit UTC.
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
const first = DChrono.getFirstDayOfMonth(date);

// La sortie représente le 1er janvier 2021 à 00:00:00.000 UTC.
type _CheckFirst = DCommon.ExpectType<typeof first, DChrono.TheDate, "strict">;

// Une date sérialisée peut être utilisée comme entrée.
const serializedFirst = DChrono.getFirstDayOfMonth("date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedFirst, DChrono.TheDate, "strict">;

