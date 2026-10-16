/**
 * @title DChrono.getTimezoneOffset
 *
 * Calculer le décalage d’un fuseau horaire pour une date donnée.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDate("2021-01-15");
const offset = DChrono.getTimezoneOffset(date, "America/New_York");

// La sortie est un décalage en millisecondes, dépendant de la date et du fuseau.
type _CheckOffset = DCommon.ExpectType<typeof offset, number, "strict">;

// La forme curifiée fixe le fuseau dans le pipe.
const piped = DCommon.pipe(
	date,
	DChrono.getTimezoneOffset("UTC"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;

// Une date sérialisée accepte les mêmes fuseaux horaires.
const serializedOffset = DChrono.getTimezoneOffset(
	"date1609459200000+",
	"Europe/Paris",
);
type _CheckSerialized = DCommon.ExpectType<typeof serializedOffset, number, "strict">;

