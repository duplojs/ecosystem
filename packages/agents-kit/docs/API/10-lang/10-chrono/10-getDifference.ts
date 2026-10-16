/**
 * @title DChrono.getDifference
 *
 * Calculer la durée signée séparant une date d’une date de référence.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const reference = DChrono.createDate("2021-01-01");
const date = DChrono.createDate("2021-01-02");
const difference = DChrono.getDifference(date, reference);

// La valeur obtenue est une TheTime positive représentant un jour.
type _CheckDifference = DCommon.ExpectType<typeof difference, DChrono.TheTime, "strict">;

// La forme curifiée fixe la référence dans le pipe.
const piped = DCommon.pipe(
	date,
	DChrono.getDifference(reference),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DChrono.TheTime, "strict">;

// Les deux dates peuvent aussi être fournies sous forme sérialisée.
const serializedDifference = DChrono.getDifference(
	"date1609545600000+",
	"date1609459200000+",
);
type _CheckSerialized = DCommon.ExpectType<typeof serializedDifference, DChrono.TheTime, "strict">;

