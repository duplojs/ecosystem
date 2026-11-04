/**
 * @title DPattern.matchWithTaggedObjectOtherwise
 *
 * Router les tags explicitement traités et transmettre les variantes restantes au fallback.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Success extends DModeling.ObjectTag<"success"> { value: number }
interface Failure extends DModeling.ObjectTag<"failure"> { reason: string }
interface Pending extends DModeling.ObjectTag<"pending"> { task: string }
type Outcome = Success | Failure | Pending;
declare const outcome: Outcome;

const result = DPattern.matchWithTaggedObjectOtherwise(
	outcome,
	{ success: (value) => value.value },
	(value) => {
		const remaining: Failure | Pending = value;
		return remaining;
	},
);
// Success retourne son nombre ; Failure et Pending restent des objets dans le résultat.
type _CheckResult = DCommon.ExpectType<typeof result, number | Failure | Pending, "strict">;
