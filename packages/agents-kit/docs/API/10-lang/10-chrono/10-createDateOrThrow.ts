/**
 * @title DChrono.createDateOrThrow
 *
 * Construire une TheDate depuis les entrées acceptées et lever une erreur si la création échoue.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");

// Une TheDate existante est renvoyée sous forme de TheDate.
const fromTheDate = DChrono.createDateOrThrow(date);

// Les formes timestamp, Date native et date sérialisée sont également acceptées.
const fromTimestamp = DChrono.createDateOrThrow(1_609_459_200_000);
const fromNativeDate = DChrono.createDateOrThrow(new Date("2021-01-01T00:00:00.000Z"));
const fromSerialized = DChrono.createDateOrThrow("date1609459200000+");

// Un objet SpoolingDate permet de fournir une valeur et des remplacements de composantes.
const fromSpoolingDate = DChrono.createDateOrThrow({
	value: "2021-01-01T00:00:00.000Z",
	hour: 12,
	minute: 34,
});

// Toutes les formes valides produisent directement une TheDate.
type _CheckInputs = DCommon.ExpectType<
	[
		typeof fromTheDate,
		typeof fromTimestamp,
		typeof fromNativeDate,
		typeof fromSerialized,
		typeof fromSpoolingDate,
	],
	[DChrono.TheDate, DChrono.TheDate, DChrono.TheDate, DChrono.TheDate, DChrono.TheDate],
	"strict"
>;

// Une entrée invalide lève CreateTheDateError au lieu de produire un Either.
