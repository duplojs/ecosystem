/**
 * @title DChrono.isSerializedTheTime
 *
 * Vérifier qu’une chaîne respecte le format sérialisé sûr d’une TheTime.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const value = "time90000+";
const isSerialized = DChrono.isSerializedTheTime(value);

// La valeur obtenue est true ; le prédicat garantit ensuite le type SerializedTheTime.
type _CheckResult = DCommon.ExpectType<typeof isSerialized, boolean, "strict">;

const negativeValue = "time1000-";
const invalidValue = "90:000";
const isNegativeSerialized = DChrono.isSerializedTheTime(negativeValue);
const isInvalidSerialized = DChrono.isSerializedTheTime(invalidValue);
type _CheckNegative = DCommon.ExpectType<typeof isNegativeSerialized, boolean, "strict">;
type _CheckInvalid = DCommon.ExpectType<typeof isInvalidSerialized, boolean, "strict">;

if (DChrono.isSerializedTheTime(value)) {
	const timeValue = DChrono.toTimeValue(value);
	type _CheckNarrowed = DCommon.ExpectType<typeof timeValue, number, "strict">;
}

