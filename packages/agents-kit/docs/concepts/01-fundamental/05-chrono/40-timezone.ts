/**
 * @title Interprétation et affichage dans un fuseau horaire.
 *
 * Interpréter une heure locale et lire ou présenter un instant dans le fuseau demandé.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

// TheDate stocke un instant absolu sous forme de timestamp, sans fuseau attaché.
// Le fuseau intervient pour interpréter une heure locale ou lire un instant dans un contexte local.
// Les fuseaux acceptés sont typés avec DChrono.Timezone.

// Une date littérale YYYY-MM-DD est interprétée en UTC.
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
// Cette opération change le timestamp : elle interprète les composantes UTC de l’entrée
// comme une heure locale
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
