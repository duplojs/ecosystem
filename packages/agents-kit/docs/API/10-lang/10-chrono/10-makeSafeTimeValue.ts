/**
 * @title DChrono.makeSafeTimeValue
 *
 * Ramener une durée vers un entier compris dans l’intervalle sûr de TheTime.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const rounded = DChrono.makeSafeTimeValue(90_000.4);
const fromNaN = DChrono.makeSafeTimeValue(Number.NaN);
const fromTooLarge = DChrono.makeSafeTimeValue(DChrono.maxTimeValue + 1);
const fromTooSmall = DChrono.makeSafeTimeValue(DChrono.minTimeValue - 1);

// Les fractions sont arrondies et NaN devient zéro.
type _CheckRounded = DCommon.ExpectType<typeof rounded, number, "strict">;
type _CheckNaN = DCommon.ExpectType<typeof fromNaN, number, "strict">;
type _CheckTooLarge = DCommon.ExpectType<typeof fromTooLarge, number, "strict">;
type _CheckTooSmall = DCommon.ExpectType<typeof fromTooSmall, number, "strict">;

