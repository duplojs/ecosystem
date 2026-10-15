/**
 * @title Calculs et comparaisons temporels.
 *
 * Transformer, comparer et décomposer des instants ou durées avec les fonctions Chrono.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

// TheDate et TheTime sont immuables : les transformations produisent de nouvelles valeurs.
// Les formes curifiées permettent de composer ces transformations dans un pipe.
const date = DChrono.createDate("2026-09-30");

// Les unités peuvent être ajoutées ou retirées directement sur une date.

// DChrono.TheDate
const nextWeek = DCommon.pipe(
	date,
	DChrono.addWeeks(1),
	DChrono.addDays(2),
	DChrono.subtractHours(3),
);

// `TheTime` permet de représenter une durée puis de l'appliquer
// à une date ou à un autre temps.
const duration = DChrono.createTime(2, "hour");

// DChrono.TheDate
const later = DCommon.pipe(
	date,
	DChrono.addTime(duration),
);

// DChrono.TheTime
const totalDuration = DCommon.pipe(
	duration,
	DChrono.addTime(DChrono.createTime(30, "minute")),
);

// La différence entre deux dates produit un TheTime signé : date moins date de référence.
const startDate = DChrono.createDate("2026-09-01");
const endDate = DChrono.createDate("2026-09-30");

// DChrono.TheTime
const difference = DCommon.pipe(
	endDate,
	DChrono.getDifference(startDate),
);

// `computeTime` permet d'exprimer un `TheTime` dans une unité donnée.

// 696
const differenceInHours = DCommon.pipe(
	difference,
	DChrono.computeTime("hour"),
);

// round ramène une date au début d’une unité du calendrier UTC.

// DChrono.TheDate -> 2026-09-30T00:00:00.000Z
const startOfDay = DChrono.round(date, "day");

// DChrono.TheDate -> 2026-09-01T00:00:00.000Z
const startOfMonth = DChrono.round(date, "month");

// Des helpers permettent de récupérer différentes parties d'une date.

const year = DChrono.getYear(date);
const month = DChrono.getMonth(date);
const day = DChrono.getDayOfMonth(date);
const week = DChrono.getWeekOfYear(date);

const firstDayOfMonth = DChrono.getFirstDayOfMonth(date);
const lastDayOfMonth = DChrono.getLastDayOfMonth(date);

// Les dates et les temps possèdent leurs propres opérateurs de comparaison.

const limitDate = DChrono.createDate("2026-10-01");

const isBeforeLimit = DChrono.lessThanDate(
	date,
	limitDate,
);

const isAfterLimit = DCommon.pipe(
	date,
	DChrono.greaterThanDate(startDate),
);

const maxDuration = DChrono.createTime(3, "hour");

const isDurationAllowed = DCommon.pipe(
	duration,
	DChrono.lessThanOrEqualTime(maxDuration),
);
