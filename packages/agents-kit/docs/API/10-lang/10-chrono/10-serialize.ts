/**
 * @title DChrono.serialize
 *
 * Convertir une TheDate ou une TheTime en chaîne sérialisée.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const serializedDate = DChrono.serialize(DChrono.createDate("2021-01-01"));
const serializedTime = DChrono.serialize(DChrono.createTimeOrThrow(2_500));

// Les résultats portent respectivement les formats SerializedTheDate et SerializedTheTime.
type _CheckDate = DCommon.ExpectType<typeof serializedDate, DChrono.SerializedTheDate, "strict">;
type _CheckTime = DCommon.ExpectType<typeof serializedTime, DChrono.SerializedTheTime, "strict">;

// Le signe encode aussi les valeurs antérieures à l’époque Unix.
const serializedPastDate = DChrono.serialize(DChrono.createDateOrThrow(-1_000));
const serializedNegativeTime = DChrono.serialize(DChrono.createTimeOrThrow(-2_500));

// Les résultats restent respectivement des chaînes de date et de durée sérialisées.
type _CheckPastDate = DCommon.ExpectType<typeof serializedPastDate, DChrono.SerializedTheDate, "strict">;
type _CheckNegativeTime = DCommon.ExpectType<typeof serializedNegativeTime, DChrono.SerializedTheTime, "strict">;

