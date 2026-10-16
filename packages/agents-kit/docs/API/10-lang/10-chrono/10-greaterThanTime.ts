/**
 * @title DChrono.greaterThanTime
 *
 * Comparer deux durées avec une relation strictement supérieure.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const time = DChrono.createTimeOrThrow(2_000);
const threshold = DChrono.createTimeOrThrow(1_000);
const result = DChrono.greaterThanTime(time, threshold);

// La comparaison produit true pour ces deux valeurs.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée fixe la seconde valeur dans le pipe.
const piped = DCommon.pipe(
	time,
	DChrono.greaterThanTime(threshold),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;

// Les formes sérialisées peuvent être comparées directement.
const serializedResult = DChrono.greaterThanTime("time2000+", "time1000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, boolean, "strict">;

