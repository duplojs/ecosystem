/**
 * @title DChrono.round
 *
 * Ramener une date au début de l’unité UTC demandée.
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
const rounded = DChrono.round(date, "day");

// La sortie représente le début du 15 janvier en UTC.
type _CheckRounded = DCommon.ExpectType<typeof rounded, DChrono.TheDate, "strict">;

// Sans unité, le jour est utilisé par défaut.
const defaultRounded = DChrono.round(date);
type _CheckDefault = DCommon.ExpectType<typeof defaultRounded, DChrono.TheDate, "strict">;

// Les autres unités de RoundUnit ramènent la date au début de leur période UTC.
const roundedSecond = DChrono.round(date, "second");
const roundedMinute = DChrono.round(date, "minute");
const roundedHour = DChrono.round(date, "hour");
const roundedMonth = DChrono.round(date, "month");
const roundedYear = DChrono.round(date, "year");

type _CheckUnits = DCommon.ExpectType<
	[typeof roundedSecond, typeof roundedMinute, typeof roundedHour, typeof roundedMonth, typeof roundedYear],
	[DChrono.TheDate, DChrono.TheDate, DChrono.TheDate, DChrono.TheDate, DChrono.TheDate],
	"strict"
>;

// Une date sérialisée peut aussi être arrondie.
const roundedSerialized = DChrono.round("date1610714096789+", "hour");
type _CheckSerialized = DCommon.ExpectType<typeof roundedSerialized, DChrono.TheDate, "strict">;

