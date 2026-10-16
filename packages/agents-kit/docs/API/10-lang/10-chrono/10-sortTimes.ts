/**
 * @title DChrono.sortTimes
 *
 * Trier des durées par ordre croissant ou décroissant.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const times = [
	DChrono.createTimeOrThrow(2_000),
	DChrono.createTimeOrThrow(1_000),
] as const;
const ascending = DChrono.sortTimes(times, "ASC");

// La nouvelle collection est triée de 1 000 à 2 000 millisecondes.
type _CheckAscending = DCommon.ExpectType<typeof ascending, DChrono.TheTime[], "strict">;

// La forme curifiée fixe l’ordre dans le pipe.
const descending = DCommon.pipe(
	times,
	DChrono.sortTimes("DSC"),
);
type _CheckDescending = DCommon.ExpectType<typeof descending, DChrono.TheTime[], "strict">;

// Une collection peut mélanger durées sérialisées et TheTime.
const mixed = DChrono.sortTimes([
	"time2000+",
	DChrono.createTimeOrThrow(1_000),
] as const, "ASC");
type _CheckMixed = DCommon.ExpectType<typeof mixed, DChrono.TheTime[], "strict">;

