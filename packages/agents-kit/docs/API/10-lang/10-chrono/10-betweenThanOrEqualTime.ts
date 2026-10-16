/**
 * @title DChrono.betweenThanOrEqualTime
 *
 * Vérifier qu’une durée est comprise entre deux bornes inclusives.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const time = DChrono.createTimeOrThrow(2_000);
const greater = DChrono.createTimeOrThrow(2_000);
const less = DChrono.createTimeOrThrow(3_000);
const result = DChrono.betweenThanOrEqualTime(time, greater, less);

// La valeur est acceptée par la relation de bornes.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée fixe les deux bornes dans le pipe.
const piped = DCommon.pipe(
	time,
	DChrono.betweenThanOrEqualTime(greater, less),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;

// Les trois bornes peuvent être des dates ou durées sérialisées selon le domaine.
const serializedResult = DChrono.betweenThanOrEqualTime("time2000+", "time2000+", "time3000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, boolean, "strict">;

