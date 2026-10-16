/**
 * @title DChrono.toDateISOString
 *
 * Convertir une date en chaîne ISO UTC.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const iso = DChrono.toDateISOString(DChrono.createDate("2021-01-01"));

// La valeur obtenue est « 2021-01-01T00:00:00.000Z ».
type _CheckIso = DCommon.ExpectType<typeof iso, string, "strict">;

// Une date sérialisée est convertie de la même manière.
const serializedIso = DChrono.toDateISOString("date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedIso, string, "strict">;

