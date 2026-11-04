/**
 * @title DPattern.matchWithTaggedObject
 *
 * Router une union d’objets marqués vers un callback par valeur de tag.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Success extends DModeling.ObjectTag<"success"> { value: number }
interface Failure extends DModeling.ObjectTag<"failure"> { reason: string }
type Outcome = Success | Failure;
declare const outcome: Outcome;

const summary = DPattern.matchWithTaggedObject(outcome, {
	success: (value) => {
		const exact: Success = value;
		return exact.value;
	},
	failure: (value) => {
		const exact: Failure = value;
		return exact.reason;
	},
});
// Success retourne value ; Failure retourne reason.
type _CheckSummary = DCommon.ExpectType<typeof summary, number | string, "strict">;
