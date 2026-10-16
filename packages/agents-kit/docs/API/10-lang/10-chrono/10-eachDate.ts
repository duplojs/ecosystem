/**
 * @title DChrono.eachDate
 *
 * Parcourir une plage de dates en avançant d’une unité et en incluant les bornes.
 */
import * as DArray from "@duplojs/lang/array";
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const dates = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-01"),
	end: DChrono.createDate("2021-01-03"),
}));

// La collection contient les dates du 1er au 3 janvier, avec un pas quotidien par défaut.
type _CheckDates = DCommon.ExpectType<typeof dates, readonly DChrono.TheDate[], "strict">;

const months = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-01"),
	end: DChrono.createDate("2021-03-01"),
}, "month"));

// Une unité explicite modifie le pas de parcours.
type _CheckMonths = DCommon.ExpectType<typeof months, readonly DChrono.TheDate[], "strict">;

// Tous les pas d’Unit peuvent être choisis pour une plage alignée.
const byHour = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-01"),
	end: DChrono.createDate("2021-01-01"),
}, "hour"));
const byMinute = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-01"),
	end: DChrono.createDate("2021-01-01"),
}, "minute"));
const bySecond = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-01"),
	end: DChrono.createDate("2021-01-01"),
}, "second"));
const byMillisecond = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-01"),
	end: DChrono.createDate("2021-01-01"),
}, "millisecond"));
const byYear = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-01"),
	end: DChrono.createDate("2021-01-01"),
}, "year"));

// Chaque parcours produit une collection de TheDate ; le pas change la progression entre les bornes.
type _CheckUnits = DCommon.ExpectType<
	[typeof byHour, typeof byMinute, typeof bySecond, typeof byMillisecond, typeof byYear],
	[
		readonly DChrono.TheDate[],
		readonly DChrono.TheDate[],
		readonly DChrono.TheDate[],
		readonly DChrono.TheDate[],
		readonly DChrono.TheDate[],
	],
	"strict"
>;

// Une borne de fin antérieure déclenche un parcours décroissant.
const descending = DArray.from(DChrono.eachDate({
	start: DChrono.createDate("2021-01-03"),
	end: DChrono.createDate("2021-01-01"),
}));
type _CheckDescending = DCommon.ExpectType<typeof descending, readonly DChrono.TheDate[], "strict">;

