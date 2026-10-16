/**
 * @title DChrono.getDayOfWeek
 *
 * Lire le jour de la semaine d’une date, de 0 pour dimanche à 6 pour samedi.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDateOrThrow({
	value: "2021-01-15",
	hour: 12,
	minute: 34,
	second: 56,
	millisecond: 789,
});
const day = DChrono.getDayOfWeek(date);

// La valeur obtenue est 5 pour le vendredi 15 janvier 2021.
type _CheckDay = DCommon.ExpectType<typeof day, number, "strict">;

const piped = DCommon.pipe(
	date,
	DChrono.getDayOfWeek,
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;

// Une date sérialisée conserve le même calcul du jour de la semaine.
const serialized = DChrono.getDayOfWeek("date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

