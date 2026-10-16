/**
 * @title DChrono.sortDates
 *
 * Trier des dates par ordre croissant ou décroissant.
 */
import * as DArray from "@duplojs/lang/array";
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const dates = [
	DChrono.createDate("2021-01-15"),
	DChrono.createDate("2021-01-01"),
] as const;
const ascending = DChrono.sortDates(dates, "ASC");

// La nouvelle collection est triée du 1er au 15 janvier.
type _CheckAscending = DCommon.ExpectType<typeof ascending, DChrono.TheDate[], "strict">;

// La forme curifiée fixe l’ordre dans le pipe.
const descending = DCommon.pipe(
	dates,
	DChrono.sortDates("DSC"),
);
type _CheckDescending = DCommon.ExpectType<typeof descending, DChrono.TheDate[], "strict">;

// Une collection peut mélanger dates sérialisées et TheDate.
const mixed = DChrono.sortDates([
	"date1609545600000+",
	DChrono.createDate("2021-01-01"),
] as const, "ASC");
type _CheckMixed = DCommon.ExpectType<typeof mixed, DChrono.TheDate[], "strict">;

