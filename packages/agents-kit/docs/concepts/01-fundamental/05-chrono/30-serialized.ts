/**
 * @title Transport et reconstruction des valeurs temporelles.
 *
 * Sérialiser, reconnaître et reconstruire les instants et durées en conservant leur valeur.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DChrono from "@duplojs/lang/chrono";

// Chrono possède un format dédié qui conserve la valeur numérique et identifie sa nature.
// Il sert au transport des données : JSON, API, persistance ou messages.
const date = DChrono.createDate("2026-09-30");
const time = DChrono.createTime(2, "hour");

// Une `TheDate` est sérialisée avec le préfixe `date`,
// suivi de son timestamp et de son signe.

const serializedDate = DChrono.serialize(date);
type _CheckSerializedDateLine18 = DCommon.ExpectType<
	typeof serializedDate,
	`date${number}-` | `date${number}+`,
	"strict"
>;

// Un `TheTime` utilise le même principe avec le préfixe `time`.

const serializedTime = DChrono.serialize(time);
type _CheckSerializedTimeLine24 = DCommon.ExpectType<
	typeof serializedTime,
	`time${number}-` | `time${number}+`,
	"strict"
>;

// Le format permet de conserver exactement la valeur transportée,
// tout en distinguant une date d'un simple nombre ou d'une string classique.

// Les instances se sérialisent également automatiquement avec JSON,
// grâce à leur méthode `toJSON`.

const payload = JSON.stringify({
	date,
	time,
});
type _CheckPayload = DCommon.ExpectType<typeof payload, string, "strict">;

// {
//     "date": "date1790726400000+",
//     "time": "time7200000+"
// }

// Une string reçue depuis l'extérieur peut être reconnue
// avant d'être utilisée comme valeur sérialisée.

declare const input: string;

if (DChrono.isSerializedTheDate(input)) {
	const serializedDate = input;
	type _CheckSerializedDateLine49 = DCommon.ExpectType<
	typeof serializedDate,
	`date${number}-` | `date${number}+`,
	"strict"
	>;
}

if (DChrono.isSerializedTheTime(input)) {
	const serializedTime = input;
	type _CheckSerializedTimeLine54 = DCommon.ExpectType<
	typeof serializedTime,
	`time${number}-` | `time${number}+`,
	"strict"
	>;
}

// Une valeur sérialisée peut ensuite être reconstruite.

const restoredDate = DChrono.createDateOrThrow(serializedDate);
const restoredTime = DChrono.createTimeOrThrow(serializedTime);

// Les fonctions de manipulation de `chrono` acceptent également
// directement les formats sérialisés dans de nombreux cas.

const nextDay = DChrono.addDays(
	serializedDate,
	1,
);

const durationInHours = DChrono.computeTime(
	serializedTime,
	"hour",
);
