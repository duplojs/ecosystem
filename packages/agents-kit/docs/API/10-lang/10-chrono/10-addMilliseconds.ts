/**
 * @title DChrono.addMilliseconds
 *
 * Ajouter un nombre de millisecondes à une date.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");
const result = DChrono.addMilliseconds(date, 1_000);

// La sortie est une nouvelle TheDate décalée de 1_000 millisecond.
type _CheckResult = DCommon.ExpectType<typeof result, DChrono.TheDate, "strict">;

// La forme curifiée fixe le décalage dans le pipe.
const piped = DCommon.pipe(
	date,
	DChrono.addMilliseconds(1_000),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DChrono.TheDate, "strict">;

// Une date sérialisée est acceptée comme premier argument.
const serializedResult = DChrono.addMilliseconds("date1609459200000+", 1000);
type _CheckSerialized = DCommon.ExpectType<typeof serializedResult, DChrono.TheDate, "strict">;

