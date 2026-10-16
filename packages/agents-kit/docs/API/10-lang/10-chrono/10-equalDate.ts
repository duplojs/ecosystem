/**
 * @title DChrono.equalDate
 *
 * Vérifier l’égalité de deux dates par leur timestamp.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");
const threshold = DChrono.createDate("2021-01-15");
const result = DChrono.equalDate(date, threshold);

// La comparaison produit true pour ces deux valeurs.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée fixe la seconde valeur dans le pipe.
const piped = DCommon.pipe(
	date,
	DChrono.equalDate(threshold),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;

// Les formes sérialisées peuvent être comparées directement.
const serializedResult = DChrono.equalDate("date1609459200000+", "date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, boolean, "strict">;

