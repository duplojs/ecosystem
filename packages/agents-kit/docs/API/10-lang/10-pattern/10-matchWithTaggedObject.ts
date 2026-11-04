/**
 * @title DPattern.matchWithTaggedObject
 *
 * Router une union d’objets marqués vers un callback par valeur de tag.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Success extends DModeling.ObjectTag<"success"> { value: number }
interface Failure extends DModeling.ObjectTag<"failure"> { reason: string }
declare const outcome: Success | Failure;

// Appel direct : chaque nom de l’union exige une branche, sans clé étrangère.
const result = DPattern.matchWithTaggedObject(outcome, {
	success: (value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, Success, "strict">;
		return value.value;
	},
	failure: (value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, Failure, "strict">;
		return value.reason;
	},
});
// La sortie est le nombre de réussite ou la raison du refus.
type _CheckResult = DCommon.ExpectType<typeof result, number | string, "strict">;

// Appel curifié : configurer les branches directement dans le pipe.
const piped = DCommon.pipe(
	outcome,
	DPattern.matchWithTaggedObject({
		success: (value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, Success, "strict">;
			return value.value;
		},
		failure: (value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, Failure, "strict">;
			return value.reason;
		},
	}),
);
// Même sélection : le nombre de réussite ou la raison du refus.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | string, "strict">;
