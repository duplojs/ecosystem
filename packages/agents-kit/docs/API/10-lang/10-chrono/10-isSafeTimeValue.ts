/**
 * @title DChrono.isSafeTimeValue
 *
 * Vérifier qu’une durée entière reste dans l’intervalle sûr de TheTime.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const isSafe = DChrono.isSafeTimeValue(90_000);

// La valeur obtenue est true pour cette durée entière représentable.
type _CheckResult = DCommon.ExpectType<typeof isSafe, boolean, "strict">;

const isFractional = DChrono.isSafeTimeValue(90_000.5);
const isTooLarge = DChrono.isSafeTimeValue(DChrono.maxTimeValue);
// Une fraction et la borne maximale sont refusées par l’intervalle sûr.
type _CheckFractional = DCommon.ExpectType<typeof isFractional, boolean, "strict">;
type _CheckTooLarge = DCommon.ExpectType<typeof isTooLarge, boolean, "strict">;

