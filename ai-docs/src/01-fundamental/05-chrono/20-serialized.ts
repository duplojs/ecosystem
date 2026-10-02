/**
 * @title Sérialisation
 *
 * `chrono` possède un format de sérialisation dédié pour `TheDate` et `TheTime`.
 *
 * Ce format conserve directement leur valeur numérique et permet de reconnaître
 * explicitement qu'une string représente une date ou un temps DuploJS.
 *
 * Il est principalement destiné au transport de données : JSON, API,
 * persistance, messages, etc.
 */
import * as DChrono from "@duplojs/lang/chrono";

const date = DChrono.createDate("2026-09-30");
const time = DChrono.createTime(2, "hour");

// Une `TheDate` est sérialisée avec le préfixe `date`,
// suivi de son timestamp et de son signe.

// DChrono.SerializedTheDate
// "date1790726400000+"
const serializedDate = DChrono.serialize(date);

// Un `TheTime` utilise le même principe avec le préfixe `time`.

// DChrono.SerializedTheTime
// "time7200000+"
const serializedTime = DChrono.serialize(time);

// Le format permet de conserver exactement la valeur transportée,
// tout en distinguant une date d'un simple nombre ou d'une string classique.

// Les instances se sérialisent également automatiquement avec JSON,
// grâce à leur méthode `toJSON`.

const payload = JSON.stringify({
	date,
	time,
});

// {
//     "date": "date1790726400000+",
//     "time": "time7200000+"
// }

// Une string reçue depuis l'extérieur peut être reconnue
// avant d'être utilisée comme valeur sérialisée.

declare const input: string;

if (DChrono.isSerializedTheDate(input)) {
	// DChrono.SerializedTheDate
	const serializedDate = input;
}

if (DChrono.isSerializedTheTime(input)) {
	// DChrono.SerializedTheTime
	const serializedTime = input;
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
