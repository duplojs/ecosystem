/**
 * @title DChrono.getDayOfMonth
 *
 * Lire le jour du mois d’une date en UTC ou dans un fuseau horaire donné.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

// Appel classique : le fuseau UTC est utilisé par défaut.
const utcDay = DChrono.getDayOfMonth(
	DChrono.createDate("2021-01-15"),
);

// La valeur obtenue est 15.
type _CheckUtcDay = DCommon.ExpectType<typeof utcDay, number, "strict">;

// Variation de fuseau horaire : le jour est calculé dans le fuseau demandé.
const newYorkDay = DChrono.getDayOfMonth(
	DChrono.createDate("2021-01-01"),
	"America/New_York",
);

// La valeur obtenue est 31, car minuit UTC correspond encore au 31 décembre à New York.
type _CheckNewYorkDay = DCommon.ExpectType<typeof newYorkDay, number, "strict">;

// Composition dans un pipe : la fonction peut être utilisée directement comme étape unaire.
const pipedDay = DCommon.pipe(
	DChrono.createDate("2021-12-25"),
	DChrono.getDayOfMonth,
);

// La valeur obtenue est 25.
type _CheckPipedDay = DCommon.ExpectType<typeof pipedDay, number, "strict">;

// Une date sérialisée est également acceptée.
const serializedDay = DChrono.getDayOfMonth("date1609459200000+");
type _CheckSerializedDay = DCommon.ExpectType<typeof serializedDay, number, "strict">;
