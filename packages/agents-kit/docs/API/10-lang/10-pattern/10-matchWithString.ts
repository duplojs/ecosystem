/**
 * @title DPattern.matchWithString
 *
 * Associer chaque chaîne littérale possible à un callback dont le paramètre est cette valeur exacte.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

declare const status: "queued" | "sent";

// Tous les littéraux de l’union ont leur branche ; chaque callback reçoit sa clé comme type.
const message = DPattern.matchWithString(status, {
	queued: (value) => {
		const exact: "queued" = value;
		return `Waiting: ${exact}`;
	},
	sent: (value) => {
		const exact: "sent" = value;
		return `Delivered: ${exact}`;
	},
});
// La sortie vaut « Waiting: queued » ou « Delivered: sent » selon le statut.
type _CheckMessage = DCommon.ExpectType<typeof message, string, "strict">;

const piped = DCommon.pipe(
	status,
	DPattern.matchWithString({
		queued: () => 0,
		sent: () => 1,
	}),
);
// Le code de sortie vaut 0 pour queued et 1 pour sent.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
