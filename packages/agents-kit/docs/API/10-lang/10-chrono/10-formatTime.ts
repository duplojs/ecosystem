/**
 * @title DChrono.formatTime
 *
 * Formater une durée TheTime avec des jetons de semaines, jours, heures, minutes, secondes et millisecondes.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const time = DChrono.createTimeOrThrow(90_061);
const formatted = DChrono.formatTime(time, "HH:mm:ss.SSS");

// La sortie est une chaîne construite à partir de la durée.
type _CheckFormatted = DCommon.ExpectType<typeof formatted, string, "strict">;

// La forme curifiée fixe le format dans l’étape de pipe.
const piped = DCommon.pipe(
	time,
	DChrono.formatTime("DD HH:mm:ss"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;

// Les jetons WW, DD, HH, mm, ss et SSS peuvent être combinés.
const allTokens = DChrono.formatTime(
	time,
	"WW DD HH mm ss SSS",
);

// La sortie représente la durée avec chacune des composantes demandées.
type _CheckAllTokens = DCommon.ExpectType<typeof allTokens, string, "strict">;

// Une durée sérialisée est acceptée directement.
const serializedTime = DChrono.formatTime(
	"time90061+",
	"HH:mm:ss.SSS",
);
type _CheckSerialized = DCommon.ExpectType<typeof serializedTime, string, "strict">;

