/**
 * @title DChrono.makeSafeTimestamp
 *
 * Ramener un timestamp vers un entier compris dans l’intervalle sûr de TheDate.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const rounded = DChrono.makeSafeTimestamp(1_609_459_200_000.4);
const fromNaN = DChrono.makeSafeTimestamp(Number.NaN);
const fromTooLarge = DChrono.makeSafeTimestamp(DChrono.maxTimestamp + 1);
const fromTooSmall = DChrono.makeSafeTimestamp(DChrono.minTimestamp - 1);

// Les fractions sont arrondies et NaN devient zéro.
type _CheckRounded = DCommon.ExpectType<typeof rounded, number, "strict">;
type _CheckNaN = DCommon.ExpectType<typeof fromNaN, number, "strict">;
type _CheckTooLarge = DCommon.ExpectType<typeof fromTooLarge, number, "strict">;
type _CheckTooSmall = DCommon.ExpectType<typeof fromTooSmall, number, "strict">;

