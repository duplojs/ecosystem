/**
 * @title DPattern.matchWithFact
 *
 * Router des facts par nom et exposer leur valeur ainsi que leur payload typé.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Created extends DModeling.Fact<"Created", { title: string }> {}
interface Deleted extends DModeling.Fact<"Deleted", { reason: string }> {}
declare const event: Created | Deleted;

const description = DPattern.matchWithFact(event, {
	Created: (_value, payload) => {
		const title: string = payload.title;
		return title;
	},
	Deleted: (_value, payload) => {
		const reason: string = payload.reason;
		return reason;
	},
});
// Chaque branche reçoit le payload associé à son nom de fact et retourne son texte.
type _CheckDescription = DCommon.ExpectType<typeof description, string, "strict">;
