/**
 * @title DChrono.betweenThanTime
 *
 * Vérifier qu’une durée est strictement comprise entre deux bornes.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const time = DChrono.createTimeOrThrow(2_000);
const greater = DChrono.createTimeOrThrow(1_000);
const less = DChrono.createTimeOrThrow(3_000);
const result = DChrono.betweenThanTime(time, greater, less);

// La valeur est acceptée par la relation de bornes.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée fixe les deux bornes dans le pipe.
const piped = DCommon.pipe(
	time,
	DChrono.betweenThanTime(greater, less),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;

// Les trois bornes peuvent être des dates ou durées sérialisées selon le domaine.
const serializedResult = DChrono.betweenThanTime("time2000+", "time1000+", "time3000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, boolean, "strict">;

