/**
 * @title DChrono.toTimestamp
 *
 * Lire le timestamp en millisecondes d’une TheDate ou d’une chaîne sérialisée.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const timestamp = DChrono.toTimestamp(DChrono.createDate("2021-01-01"));

// La valeur obtenue représente 2021-01-01T00:00:00.000Z en millisecondes.
type _CheckTimestamp = DCommon.ExpectType<typeof timestamp, number, "strict">;

// Une date sérialisée produit le même timestamp.
const serializedTimestamp = DChrono.toTimestamp("date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedTimestamp, number, "strict">;

