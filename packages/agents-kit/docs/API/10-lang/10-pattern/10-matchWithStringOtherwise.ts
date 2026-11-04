/**
 * @title DPattern.matchWithStringOtherwise
 *
 * Traiter certains littéraux de chaîne et transmettre au fallback l’union non couverte.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const status: "queued" | "sent" | "cancelled";

const description = DPattern.matchWithStringOtherwise(
	status,
	{
		queued: () => "Waiting",
		sent: () => "Delivered",
	},
	(value) => {
		type _CheckRemaining = DCommon.ExpectType<typeof value, "cancelled", "strict">;
		return DString.prepend(value, "Stopped: ");
	},
);
// Le statut sélectionné fournit son libellé ; cancelled donne « Stopped: cancelled ».
type _CheckDescription = DCommon.ExpectType<typeof description, string, "strict">;

// La forme curifiée fixe les handlers avant de recevoir le statut dans un pipe.
const piped = DCommon.pipe(
	status,
	DPattern.matchWithStringOtherwise(
		{ sent: () => 200 },
		DString.toUpperCase,
	),
);
// Sent retourne un code ; queued et cancelled sont convertis en majuscules.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | "QUEUED" | "CANCELLED", "strict">;
