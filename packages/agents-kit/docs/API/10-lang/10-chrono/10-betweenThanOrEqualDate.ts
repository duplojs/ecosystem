/**
 * @title DChrono.betweenThanOrEqualDate
 *
 * Vérifier qu’une date est comprise entre deux bornes inclusives.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");
const greater = DChrono.createDate("2021-01-15");
const less = DChrono.createDate("2021-01-31");
const result = DChrono.betweenThanOrEqualDate(date, greater, less);

// La valeur est acceptée par la relation de bornes.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée fixe les deux bornes dans le pipe.
const piped = DCommon.pipe(
	date,
	DChrono.betweenThanOrEqualDate(greater, less),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;

// Les trois bornes peuvent être des dates ou durées sérialisées selon le domaine.
const serializedResult = DChrono.betweenThanOrEqualDate("date1609459200000+", "date1609459200000+", "date1620000000000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, boolean, "strict">;

