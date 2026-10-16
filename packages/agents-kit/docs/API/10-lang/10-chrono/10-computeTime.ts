/**
 * @title DChrono.computeTime
 *
 * Convertir une durée représentée par TheTime vers l’unité demandée.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const time = DChrono.createTimeOrThrow(90_061);
const inSeconds = DChrono.computeTime(time, "second");

// La valeur obtenue est 90.061.
type _CheckSeconds = DCommon.ExpectType<typeof inSeconds, number, "strict">;

// La forme curifiée fixe l’unité dans le pipe.
const inMinutes = DCommon.pipe(
	time,
	DChrono.computeTime("minute"),
);

// La sortie représente la durée exprimée en minutes.
type _CheckMinutes = DCommon.ExpectType<typeof inMinutes, number, "strict">;

// Les six unités acceptées produisent toujours un nombre exprimé dans l’unité choisie.
const inWeeks = DChrono.computeTime(time, "week");
const inDays = DChrono.computeTime(time, "day");
const inHours = DChrono.computeTime(time, "hour");
const inMilliseconds = DChrono.computeTime(time, "millisecond");

type _CheckUnits = DCommon.ExpectType<
	[typeof inWeeks, typeof inDays, typeof inHours, typeof inMinutes, typeof inSeconds, typeof inMilliseconds],
	[number, number, number, number, number, number],
	"strict"
>;

