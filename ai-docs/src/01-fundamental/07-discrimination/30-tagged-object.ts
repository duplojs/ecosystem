/**
 * @title Discrimination des `TaggedObject`.
 *
 * Un `TaggedObject` possède une identité associée à son tag.
 *
 * Cette identité fait partie de la donnée et peut être utilisée pour
 * discriminer une union de `TaggedObject` sans dépendre de leurs propriétés.
 *
 * Le domaine `pattern` fournit des matchers dédiés à cette discrimination.
 *
 * `matchWithTaggedObject` réalise une discrimination exhaustive.
 * `matchWithTaggedObjectOtherwise` permet de ne traiter explicitement
 * qu'une partie des tags et de regrouper les autres dans un fallback.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";
import * as DPattern from "@duplojs/lang/pattern";

interface EmailNotification extends DModeling.ObjectTag<"EmailNotification"> {
	readonly email: string;
	readonly subject: string;
}

interface SmsNotification extends DModeling.ObjectTag<"SmsNotification"> {
	readonly phone: string;
	readonly message: string;
}

type Notification =
	| EmailNotification
	| SmsNotification;

declare const notification: Notification;

// `matchWithTaggedObject` discrimine une union à partir du tag
// porté par chaque `TaggedObject`.
//
// La sélection est exhaustive : chaque tag présent dans l'union
// doit posséder un handler.
//
// Chaque callback reçoit directement le `TaggedObject` précis
// correspondant au tag sélectionné.

// string
const matchedNotification = DPattern.matchWithTaggedObject(
	notification,
	{
		// EmailNotification
		EmailNotification: (emailNotification) => emailNotification.email,

		// SmsNotification
		SmsNotification: (smsNotification) => smsNotification.phone,
	},
);

// La sélection exhaustive crée un point d'ancrage dans le typage.
//
// Si un nouveau `TaggedObject` est ajouté à l'union, le matcher devra
// également définir son traitement.
//
// À l'inverse, une clé ne correspondant à aucun tag de l'union
// ne peut pas être ajoutée au matcher.

// `matchWithTaggedObject` possède également une forme curried afin d'être
// directement utilisée dans un pipe.

// string
const matchedNotificationInPipe = DCommon.pipe(
	notification,
	DPattern.matchWithTaggedObject({
		// EmailNotification
		EmailNotification: (emailNotification) => emailNotification.email,

		// SmsNotification
		SmsNotification: (smsNotification) => smsNotification.phone,
	}),
);

// `matchWithTaggedObjectOtherwise` permet de ne sélectionner explicitement
// qu'une partie des tags.
//
// `otherwise` reçoit uniquement les `TaggedObject` qui n'ont pas déjà
// été pris en charge par le matcher.

// string
const matchedNotificationOtherwise = DPattern.matchWithTaggedObjectOtherwise(
	notification,
	{
		// EmailNotification
		EmailNotification: (emailNotification) => emailNotification.email,
	},
	// SmsNotification
	(smsNotification) => smsNotification.phone,
);

// La forme curried est également disponible.
//
// Le typage de `otherwise` évolue avec les handlers déjà déclarés.
// Il représente toujours précisément le reste de l'union de `TaggedObject`.

// string
const matchedNotificationOtherwiseInPipe = DCommon.pipe(
	notification,
	DPattern.matchWithTaggedObjectOtherwise(
		{
			// EmailNotification
			EmailNotification: (emailNotification) => emailNotification.email,
		},
		// SmsNotification
		(smsNotification) => smsNotification.phone,
	),
);
