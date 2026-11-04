/**
 * @title DPattern.matchWithString
 *
 * Associer chaque chaîne littérale possible à un callback dont le paramètre est cette valeur exacte.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const status: "queued" | "sent";

// Tous les littéraux de l’union ont leur branche ; chaque callback reçoit sa clé comme type.
const message = DPattern.matchWithString(status, {
	queued: (value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, "queued", "strict">;
		return DString.prepend(value, "Waiting: ");
	},
	sent: (value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, "sent", "strict">;
		return DString.prepend(value, "Delivered: ");
	},
});
// La sortie vaut « Waiting: queued » ou « Delivered: sent » selon le statut.
type _CheckMessage = DCommon.ExpectType<typeof message, "Waiting: queued" | "Delivered: sent", "strict">;

const piped = DCommon.pipe(
	status,
	DPattern.matchWithString({
		queued: () => 0,
		sent: () => 1,
	}),
);
// Le code de sortie vaut 0 pour queued et 1 pour sent.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
