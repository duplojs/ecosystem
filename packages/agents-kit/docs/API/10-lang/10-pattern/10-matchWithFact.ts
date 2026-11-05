/**
 * @title DPattern.matchWithFact
 *
 * Router des facts par nom et exposer leur valeur ainsi que leur payload typé.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Created extends DModeling.Fact<"Created", { title: string }> {}
interface Deleted extends DModeling.Fact<"Deleted", { reason: string }> {}
declare const event: Created | Deleted;

// Appel direct : chaque nom de l’union exige une branche, sans clé étrangère.
// Le nom de Fact, et non celui d’Entity, sélectionne la branche.
// Le second argument de chaque callback contient le payload.
const result = DPattern.matchWithFact(event, {
	Created: (value, payload) => {
		type _CheckValue = DCommon.ExpectType<typeof value, Created, "strict">;
		type _CheckPayload = DCommon.ExpectType<typeof payload, { title: string }, "strict">;
		return payload.title;
	},
	Deleted: (value, payload) => {
		type _CheckValue = DCommon.ExpectType<typeof value, Deleted, "strict">;
		type _CheckPayload = DCommon.ExpectType<typeof payload, { reason: string }, "strict">;
		return payload.reason;
	},
});
// La sortie est le titre de Created ou la raison de Deleted.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

// Appel curifié : configurer les branches directement dans le pipe.
const piped = DCommon.pipe(
	event,
	DPattern.matchWithFact({
		Created: (value, payload) => {
			type _CheckValue = DCommon.ExpectType<typeof value, Created, "strict">;
			type _CheckPayload = DCommon.ExpectType<typeof payload, { title: string }, "strict">;
			return payload.title;
		},
		Deleted: (value, payload) => {
			type _CheckValue = DCommon.ExpectType<typeof value, Deleted, "strict">;
			type _CheckPayload = DCommon.ExpectType<typeof payload, { reason: string }, "strict">;
			return payload.reason;
		},
	}),
);
// Même sélection : le titre de Created ou la raison de Deleted.
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
