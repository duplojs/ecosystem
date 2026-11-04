/**
 * @title Création des instants et des durées.
 *
 * Valeurs connues statiquement ou reçues au runtime, et gestion des entrées invalides.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DChrono from "@duplojs/lang/chrono";
import type * as DEither from "@duplojs/lang/either";

// TheDate représente un instant absolu ; TheTime représente une quantité de temps.
// Lorsque le typage peut établir la validité de l’entrée, la création retourne directement
// TheDate ou TheTime. Sinon, un Either exprime la réussite ou l’échec de la création.

// Les dates littérales au format YYYY-MM-DD sont vérifiées par le typage.

const date = DChrono.createDate("2026-09-30");
type _CheckDateLine15 = DCommon.ExpectType<
	typeof date,
	DChrono.TheDate,
	"strict"
>;

// Les temps sont également sûrs lorsque la valeur littérale
// et son unité permettent d'être vérifiées par le typage.

const time = DChrono.createTime(2, "hour");
type _CheckTimeLine21 = DCommon.ExpectType<
	typeof time,
	DChrono.TheTime,
	"strict"
>;

// Lorsque la valeur provient du runtime, sa validité n'est plus garantie.
declare const dateInput: string;
declare const timeInput: number;

const maybeDate = DChrono.createDate({
	value: dateInput,
});
type _CheckMaybeDateLine30 = DCommon.ExpectType<
	typeof maybeDate,
	DEither.Right<"date-created", DChrono.TheDate> | DEither.Left<"date-created-error", null>,
	"strict"
>;

// Sans unité explicite, l’entrée numérique représente des millisecondes.
const maybeTime = DChrono.createTime(timeInput);
type _CheckMaybeTime = DCommon.ExpectType<typeof maybeTime, DChrono.MayBeTime, "strict">;

// Les variantes `OrThrow` permettent de récupérer directement la valeur.
// Une entrée invalide provoquera une `CreateTheDateError`
// ou une `CreateTheTimeError`.

const dateOrThrow = DChrono.createDateOrThrow({
	value: dateInput,
});
type _CheckDateOrThrowLine45 = DCommon.ExpectType<
	typeof dateOrThrow,
	DChrono.TheDate,
	"strict"
>;

const timeOrThrow = DChrono.createTimeOrThrow(timeInput);
type _CheckTimeOrThrowLine50 = DCommon.ExpectType<
	typeof timeOrThrow,
	DChrono.TheTime,
	"strict"
>;

// Les objets natifs et timestamps sont également considérés
// comme des valeurs runtime potentiellement invalides.

const maybeNativeDate = DChrono.createDate(new Date());
type _CheckMaybeNativeDateLine56 = DCommon.ExpectType<
	typeof maybeNativeDate,
	DChrono.MayBeDate,
	"strict"
>;

const currentDate = DChrono.now();
type _CheckCurrentDate = DCommon.ExpectType<
	typeof currentDate,
	DChrono.TheDate,
	"strict"
>;
