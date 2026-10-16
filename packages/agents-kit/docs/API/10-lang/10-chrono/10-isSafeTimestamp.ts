/**
 * @title DChrono.isSafeTimestamp
 *
 * Vérifier qu’un timestamp entier reste dans l’intervalle sûr de TheDate.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const isSafe = DChrono.isSafeTimestamp(1_609_459_200_000);

// La valeur obtenue est true pour ce timestamp entier représentable.
type _CheckResult = DCommon.ExpectType<typeof isSafe, boolean, "strict">;

const isFractional = DChrono.isSafeTimestamp(1_609_459_200_000.5);
const isTooLarge = DChrono.isSafeTimestamp(DChrono.maxTimestamp);
// Une fraction et la borne maximale sont refusées par l’intervalle sûr.
type _CheckFractional = DCommon.ExpectType<typeof isFractional, boolean, "strict">;
type _CheckTooLarge = DCommon.ExpectType<typeof isTooLarge, boolean, "strict">;

