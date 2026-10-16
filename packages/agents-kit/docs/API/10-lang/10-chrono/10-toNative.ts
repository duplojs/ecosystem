/**
 * @title DChrono.toNative
 *
 * Convertir une TheDate en Date native ou une TheTime en nombre de millisecondes.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const nativeDate = DChrono.toNative(DChrono.createDate("2021-01-01"));
const nativeTime = DChrono.toNative(DChrono.createTimeOrThrow(2_500));

// La surcharge choisie par l’entrée produit respectivement Date et number.
type _CheckDate = DCommon.ExpectType<typeof nativeDate, Date, "strict">;
type _CheckTime = DCommon.ExpectType<typeof nativeTime, number, "strict">;

// Les formes sérialisées sélectionnent les mêmes surcharges selon leur préfixe.
const nativeSerializedDate = DChrono.toNative("date1609459200000+");
const nativeSerializedTime = DChrono.toNative("time2500+");

type _CheckSerialized = DCommon.ExpectType<
	[typeof nativeSerializedDate, typeof nativeSerializedTime],
	[Date, number],
	"strict"
>;

