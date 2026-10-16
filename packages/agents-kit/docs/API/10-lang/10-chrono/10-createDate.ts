/**
 * @title DChrono.createDate
 *
 * Construire une date depuis une valeur sûre ou représenter la validation d’une entrée runtime avec un Either.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

// Une chaîne de date sûre est vérifiée par le typage et produit directement une TheDate.
const safeDate = DChrono.createDate("2021-01-15");

// La valeur obtenue représente le 15 janvier 2021 à minuit UTC.
type _CheckSafeDate = DCommon.ExpectType<typeof safeDate, DChrono.TheDate, "strict">;

// Les paramètres horaires complètent une chaîne de date sûre.
const safeDateWithTime = DChrono.createDate("2024-06-05", {
	hour: "23",
	minute: "59",
	second: "59",
	millisecond: "999",
});

// La valeur obtenue représente le 5 juin 2024 à 23:59:59.999 UTC.
type _CheckSafeDateWithTime = DCommon.ExpectType<typeof safeDateWithTime, DChrono.TheDate, "strict">;

// Les années bissextiles sont aussi vérifiées lorsque la date est un littéral.
const leapDay = DChrono.createDate("2024-02-29");
type _CheckLeapDay = DCommon.ExpectType<typeof leapDay, DChrono.TheDate, "strict">;

// @ts-expect-error Une date littérale doit respecter le calendrier grégorien.
DChrono.createDate("2023-02-29");

// Une TheDate existante peut être réutilisée comme entrée ; sa sortie reste un Either.
const fromTheDate = DChrono.createDate(safeDate);

// Un timestamp produit un Right si sa valeur est dans l’intervalle sûr.
const fromTimestamp = DChrono.createDate(1_609_459_200_000);

// Une Date native valide est également convertie vers un Right.
const fromNativeDate = DChrono.createDate(new Date("2021-01-01T00:00:00.000Z"));

// Une chaîne sérialisée accepte le format produit par DChrono.serialize.
const fromSerializedDate = DChrono.createDate("date1609459200000+");

// Ces quatre formes runtime ont toutes le contrat MayBeDate : Right contient la TheDate, Left signale le refus.
type _CheckRuntimeInputs = DCommon.ExpectType<
	[typeof fromTheDate, typeof fromTimestamp, typeof fromNativeDate, typeof fromSerializedDate],
	[DChrono.MayBeDate, DChrono.MayBeDate, DChrono.MayBeDate, DChrono.MayBeDate],
	"strict"
>;

if (DEither.isRight(fromTimestamp)) {
	const serialized = DChrono.serialize(DEither.unwrapRight(fromTimestamp));

	// La sortie est « date1609459200000+ » pour ce timestamp.
	type _CheckSerialized = DCommon.ExpectType<typeof serialized, DChrono.SerializedTheDate, "strict">;
}

// Un objet SpoolingDate peut partir d’un ISO, d’un timestamp, d’une Date native,
// d’une chaîne sérialisée ou d’une TheDate.
const fromIsoObject = DChrono.createDate({
	value: "2021-01-01T00:00:00.000Z",
});
const fromTimestampObject = DChrono.createDate({ value: 1_609_459_200_000 });
const fromNativeDateObject = DChrono.createDate({
	value: new Date("2021-01-01T00:00:00.000Z"),
});
const fromSerializedObject = DChrono.createDate({ value: "date1609459200000+" });
const fromTheDateObject = DChrono.createDate({ value: safeDate });

// Chaque objet produit un Either, car sa valeur et ses options sont vérifiées au runtime.
type _CheckSpoolingValues = DCommon.ExpectType<
	[
		typeof fromIsoObject,
		typeof fromTimestampObject,
		typeof fromNativeDateObject,
		typeof fromSerializedObject,
		typeof fromTheDateObject,
	],
	[
		DChrono.MayBeDate,
		DChrono.MayBeDate,
		DChrono.MayBeDate,
		DChrono.MayBeDate,
		DChrono.MayBeDate,
	],
	"strict"
>;

// Les propriétés de SpoolingDate peuvent remplacer chaque composante de la valeur de départ.
const withOverrides = DChrono.createDate({
	value: new Date("2020-01-01T00:00:00.000Z"),
	year: 2022,
	month: 1,
	day: 2,
	hour: 3,
	minute: 4,
	second: 5,
	millisecond: 6,
});

// La sortie est un Right si les remplacements restent dans l’intervalle des dates sûres.
type _CheckOverrides = DCommon.ExpectType<typeof withOverrides, DChrono.MayBeDate, "strict">;

// Un fuseau horaire applique ensuite son décalage à la date reconstruite.
const withTimezone = DChrono.createDate({
	value: "2024-01-01T00:00:00.000Z",
	timezone: "America/New_York",
});

// Une timezone invalide ou une entrée non reconnue produit un Left au lieu d’une date.
const invalid = DChrono.createDate(new Date(Number.NaN));
type _CheckTimezone = DCommon.ExpectType<typeof withTimezone, DChrono.MayBeDate, "strict">;
type _CheckInvalid = DCommon.ExpectType<typeof invalid, DChrono.MayBeDate, "strict">;

if (DEither.isLeft(invalid)) {
	// La valeur obtenue est Left<"date-created-error", null>.
	const errorValue = DEither.unwrapLeft(invalid);
	type _CheckError = DCommon.ExpectType<typeof errorValue, null, "strict">;
}

