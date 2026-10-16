/**
 * @title DChrono.addMonths
 *
 * Ajouter un nombre de mois à une date en UTC.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");
const result = DChrono.addMonths(date, 1);

// La sortie est une nouvelle TheDate décalée de 1 month.
type _CheckResult = DCommon.ExpectType<typeof result, DChrono.TheDate, "strict">;

// La forme curifiée fixe le décalage dans le pipe.
const piped = DCommon.pipe(
	date,
	DChrono.addMonths(1),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DChrono.TheDate, "strict">;

// Une date sérialisée est acceptée comme premier argument.
const serializedResult = DChrono.addMonths("date1609459200000+", 1);
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, DChrono.TheDate, "strict">;

