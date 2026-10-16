/**
 * @title DChrono.lessThanOrEqualTime
 *
 * Comparer deux durées avec une relation inférieure ou égale.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const time = DChrono.createTimeOrThrow(2_000);
const threshold = DChrono.createTimeOrThrow(2_000);
const result = DChrono.lessThanOrEqualTime(time, threshold);

// La comparaison produit true pour ces deux valeurs.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée fixe la seconde valeur dans le pipe.
const piped = DCommon.pipe(
	time,
	DChrono.lessThanOrEqualTime(threshold),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;

// Les formes sérialisées peuvent être comparées directement.
const serializedResult = DChrono.lessThanOrEqualTime("time2000+", "time2000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, boolean, "strict">;

