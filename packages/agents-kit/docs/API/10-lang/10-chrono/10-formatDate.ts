/**
 * @title DChrono.formatDate
 *
 * Formater une date avec des jetons et un fuseau horaire.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");
const formatted = DChrono.formatDate(
	date,
	"YYYY-MM-DD HH:mm:ss ZZ",
	"UTC",
);

// La sortie est une chaîne où chaque jeton est remplacé par la partie correspondante de la date.
type _CheckFormatted = DCommon.ExpectType<typeof formatted, string, "strict">;

// La forme curifiée fixe le format et le fuseau dans le pipe.
const piped = DCommon.pipe(
	date,
	DChrono.formatDate("YYYY/MM/DD", "UTC"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;

// Les jetons YYYY, YY, MM, DD, HH, mm, ss, SSS et ZZ peuvent être combinés.
const allTokens = DChrono.formatDate(
	date,
	"YYYY YY MM DD HH mm ss SSS ZZ",
	"Europe/Paris",
);

// La sortie reste une chaîne, avec chaque jeton remplacé par la composante demandée.
type _CheckAllTokens = DCommon.ExpectType<typeof allTokens, string, "strict">;

// Une date sérialisée est acceptée par la même surcharge que TheDate.
const serializedDate = DChrono.formatDate(
	"date1609459200000+",
	"YYYY-MM-DD",
	"UTC",
);
type _CheckSerialized = DCommon.ExpectType<typeof serializedDate, string, "strict">;

