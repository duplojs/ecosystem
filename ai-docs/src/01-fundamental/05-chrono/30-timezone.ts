/**
 * @title Gestion des fuseaux horaires.
 *
 * `TheDate` représente toujours un instant absolu à travers son timestamp.
 * Le fuseau horaire intervient uniquement lorsqu'une date locale doit être
 * interprétée ou lorsqu'un instant doit être lu dans un contexte local.
 *
 * Les fuseaux acceptés sont typés avec `DChrono.Timezone`.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

// Une date déclarée sans timezone est interprétée en UTC.
const utcDate = DChrono.createDate("2026-09-30");

// Une date provenant d'une valeur locale peut préciser son fuseau.
//
// Ici, "2026-09-30T09:00:00" représente 09:00 à Paris.
// Le `TheDate` obtenu conserve l'instant correspondant sous forme de timestamp.
const parisDate = DChrono.createDateOrThrow({
	value: "2026-09-30T09:00:00",
	timezone: "Europe/Paris",
});

// `applyTimezone` permet la même conversion lorsqu'une `TheDate` existe déjà.
//
// La date fournie est considérée comme représentant une heure locale
// dans le fuseau demandé, puis convertie vers l'instant correspondant.
const localDate = DChrono.createDate("2026-09-30", {
	hour: "09",
});

// DChrono.TheDate
const instant = DCommon.pipe(
	localDate,
	DChrono.applyTimezone("Europe/Paris"),
);

// `getTimezoneOffset` retourne le décalage du fuseau pour une date donnée.
// Ce décalage dépend notamment des changements d'heure saisonniers.

// number, en millisecondes
const parisOffset = DChrono.getTimezoneOffset(
	instant,
	"Europe/Paris",
);

// Pour lire une date dans un fuseau, il ne faut pas modifier son timestamp.
// Les getters acceptent directement un timezone.

const year = DChrono.getYear(
	instant,
	"Europe/Paris",
);

const month = DChrono.getMonth(
	instant,
	"Europe/Paris",
);

const day = DChrono.getDayOfMonth(
	instant,
	"Europe/Paris",
);

const hour = DChrono.getHour(
	instant,
	"Europe/Paris",
);

// `formatDate` suit le même principe :
// l'instant reste identique, seule sa représentation dépend du fuseau.

const formattedDate = DCommon.pipe(
	instant,
	DChrono.formatDate(
		"YYYY-MM-DD HH:mm:ss ZZ",
		"Europe/Paris",
	),
);
