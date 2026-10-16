/**
 * @title DChrono.isSerializedTheDate
 *
 * Vérifier qu’une chaîne respecte le format sérialisé sûr d’une TheDate.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const value = "date1609459200000+";
const isSerialized = DChrono.isSerializedTheDate(value);

// La valeur obtenue est true ; le prédicat garantit ensuite le type SerializedTheDate.
type _CheckResult = DCommon.ExpectType<typeof isSerialized, boolean, "strict">;

const negativeValue = "date1000-";
const invalidValue = "2021-01-01";
const isNegativeSerialized = DChrono.isSerializedTheDate(negativeValue);
const isInvalidSerialized = DChrono.isSerializedTheDate(invalidValue);
type _CheckNegative = DCommon.ExpectType<typeof isNegativeSerialized, boolean, "strict">;
type _CheckInvalid = DCommon.ExpectType<typeof isInvalidSerialized, boolean, "strict">;

if (DChrono.isSerializedTheDate(value)) {
	const timestamp = DChrono.toTimestamp(value);
	type _CheckNarrowed = DCommon.ExpectType<typeof timestamp, number, "strict">;
}

