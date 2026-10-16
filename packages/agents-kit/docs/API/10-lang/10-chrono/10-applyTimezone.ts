/**
 * @title DChrono.applyTimezone
 *
 * Décaler une date pour l’exprimer dans un fuseau horaire donné.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");
const shifted = DChrono.applyTimezone(date, "America/New_York");

// La sortie est une nouvelle TheDate représentant la date décalée selon le fuseau.
type _CheckShifted = DCommon.ExpectType<typeof shifted, DChrono.TheDate, "strict">;

// La forme curifiée fixe le fuseau dans une étape de pipe.
const piped = DCommon.pipe(
	date,
	DChrono.applyTimezone("America/New_York"),
);

type _CheckPiped = DCommon.ExpectType<typeof piped, DChrono.TheDate, "strict">;

// Une date sérialisée est également acceptée comme entrée.
const shiftedSerialized = DChrono.applyTimezone(
	"date1609459200000+",
	"Europe/Paris",
);
type _CheckSerialized = DCommon.ExpectType<typeof shiftedSerialized, DChrono.TheDate, "strict">;

