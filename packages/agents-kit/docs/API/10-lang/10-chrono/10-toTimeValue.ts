/**
 * @title DChrono.toTimeValue
 *
 * Lire la valeur en millisecondes d’une TheTime ou d’une chaîne sérialisée.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const value = DChrono.toTimeValue(DChrono.createTimeOrThrow(2_500));

// La valeur obtenue est 2 500.
type _CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

// Une durée sérialisée produit la même valeur en millisecondes.
const serializedValue = DChrono.toTimeValue("time2500+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedValue, number, "strict">;

