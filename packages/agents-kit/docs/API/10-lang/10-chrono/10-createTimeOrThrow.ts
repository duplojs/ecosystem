/**
 * @title DChrono.createTimeOrThrow
 *
 * Construire une TheTime depuis les entrées acceptées et lever une erreur si la création échoue.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const time = DChrono.createTimeOrThrow(90_000);

// Une TheTime existante peut être réutilisée.
const fromTheTime = DChrono.createTimeOrThrow(time);

// Les formes sérialisée et SpoolingTime sont également acceptées.
const fromSerialized = DChrono.createTimeOrThrow("time90000+");
const fromSpoolingTime = DChrono.createTimeOrThrow({
	value: 60_000,
	second: 30,
});

// Toutes les formes valides produisent directement une TheTime.
type _CheckInputs = DCommon.ExpectType<
	[typeof time, typeof fromTheTime, typeof fromSerialized, typeof fromSpoolingTime],
	[DChrono.TheTime, DChrono.TheTime, DChrono.TheTime, DChrono.TheTime],
	"strict"
>;

// Une entrée invalide lève CreateTheTimeError au lieu de produire un Either.
