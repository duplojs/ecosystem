/**
 * @title DChrono.createTime
 *
 * Construire une TheTime depuis une durée sûre ou représenter la validation d’une entrée runtime avec un Either.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

// Une valeur accompagnée d’une unité produit directement une TheTime.
const safeTime = DChrono.createTime(2, "hour");

// La valeur obtenue représente deux heures en millisecondes.
type _CheckSafeTime = DCommon.ExpectType<typeof safeTime, DChrono.TheTime, "strict">;

// Chaque unité publique peut être utilisée avec cette forme d’appel.
const byWeek = DChrono.createTime(1, "week");
const byDay = DChrono.createTime(1, "day");
const byHour = DChrono.createTime(1, "hour");
const byMinute = DChrono.createTime(1, "minute");
const bySecond = DChrono.createTime(1, "second");
const byMillisecond = DChrono.createTime(1, "millisecond");

// Chaque sortie est une TheTime ; l’unité choisit la conversion en millisecondes.
type _CheckUnits = DCommon.ExpectType<
	[typeof byWeek, typeof byDay, typeof byHour, typeof byMinute, typeof bySecond, typeof byMillisecond],
	[DChrono.TheTime, DChrono.TheTime, DChrono.TheTime, DChrono.TheTime, DChrono.TheTime, DChrono.TheTime],
	"strict"
>;

// Sans unité, un nombre représente directement des millisecondes et sa validité est vérifiée au runtime.
const fromMilliseconds = DChrono.createTime(90_000);

// Une chaîne sérialisée est également validée au runtime.
const fromSerialized = DChrono.createTime("time90000+");

// Une TheTime existante passe par la forme d’entrée runtime.
const fromTheTime = DChrono.createTime(safeTime);

type _CheckRuntimeInputs = DCommon.ExpectType<
	[typeof fromMilliseconds, typeof fromSerialized, typeof fromTheTime],
	[DChrono.MayBeTime, DChrono.MayBeTime, DChrono.MayBeTime],
	"strict"
>;

if (DEither.isRight(fromMilliseconds)) {
	const serialized = DChrono.serialize(DEither.unwrapRight(fromMilliseconds));

	// La sortie représente la durée validée sous forme de SerializedTheTime.
	type _CheckSerialized = DCommon.ExpectType<typeof serialized, DChrono.SerializedTheTime, "strict">;
}

// Un objet SpoolingTime peut combiner une valeur de départ et des décalages dans toutes les unités.
const fromSpoolingObject = DChrono.createTime({
	value: "01:02:03.004Z",
	week: 1,
	day: 2,
	hour: 3,
	minute: 4,
	second: 5,
	millisecond: 6,
});

// L’objet produit un Either : Right contient la durée reconstruite, Left signale une entrée invalide.
type _CheckSpoolingObject = DCommon.ExpectType<typeof fromSpoolingObject, DChrono.MayBeTime, "strict">;

// Les trois valeurs acceptées par SpoolingTime peuvent aussi être utilisées séparément.
const fromNumberObject = DChrono.createTime({ value: 2_500 });
const fromSerializedObject = DChrono.createTime({ value: "time2500+" });
const fromTheTimeObject = DChrono.createTime({ value: safeTime });

type _CheckSpoolingValues = DCommon.ExpectType<
	[typeof fromNumberObject, typeof fromSerializedObject, typeof fromTheTimeObject],
	[DChrono.MayBeTime, DChrono.MayBeTime, DChrono.MayBeTime],
	"strict"
>;

// Une valeur qui dépasse l’intervalle sûr devient un Left plutôt qu’une TheTime invalide.
const invalid = DChrono.createTime(Number.MAX_SAFE_INTEGER + 1);
type _CheckInvalid = DCommon.ExpectType<typeof invalid, DChrono.MayBeTime, "strict">;

if (DEither.isLeft(invalid)) {
	// La valeur obtenue est Left<"time-created-error", null>.
	const errorValue = DEither.unwrapLeft(invalid);
	type _CheckError = DCommon.ExpectType<typeof errorValue, null, "strict">;
}
