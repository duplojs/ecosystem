/**
 * @title Création des instants et des durées.
 *
 * Valeurs connues statiquement ou reçues au runtime, et gestion des entrées invalides.
 */
import * as DChrono from "@duplojs/lang/chrono";

// TheDate représente un instant absolu ; TheTime représente une quantité de temps.
// Lorsque le typage peut établir la validité de l’entrée, la création retourne directement
// TheDate ou TheTime. Sinon, un Either exprime la réussite ou l’échec de la création.

// Les dates littérales au format YYYY-MM-DD sont vérifiées par le typage.

// DChrono.TheDate
const date = DChrono.createDate("2026-09-30");

// Les temps sont également sûrs lorsque la valeur littérale
// et son unité permettent d'être vérifiées par le typage.

// DChrono.TheTime
const time = DChrono.createTime(2, "hour");

// Lorsque la valeur provient du runtime, sa validité n'est plus garantie.
declare const dateInput: string;
declare const timeInput: number;

// DChrono.MayBeDate
// DEither.Right<"date-created", DChrono.TheDate>
// | DEither.Left<"date-created-error", null>
const maybeDate = DChrono.createDate({
	value: dateInput,
});

// DChrono.MayBeTime
// DEither.Right<"time-created", DChrono.TheTime>
// | DEither.Left<"time-created-error", null>
// Sans unité explicite, l’entrée numérique représente des millisecondes.
const maybeTime = DChrono.createTime(timeInput);

// Les variantes `OrThrow` permettent de récupérer directement la valeur.
// Une entrée invalide provoquera une `CreateTheDateError`
// ou une `CreateTheTimeError`.

// DChrono.TheDate
const dateOrThrow = DChrono.createDateOrThrow({
	value: dateInput,
});

// DChrono.TheTime
const timeOrThrow = DChrono.createTimeOrThrow(timeInput);

// Les objets natifs et timestamps sont également considérés
// comme des valeurs runtime potentiellement invalides.

// DChrono.MayBeDate
const maybeNativeDate = DChrono.createDate(new Date());

// DChrono.MayBeDate
const maybeTimestampDate = DChrono.createDate(Date.now());
