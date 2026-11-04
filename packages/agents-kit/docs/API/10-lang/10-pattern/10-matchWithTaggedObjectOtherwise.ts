/**
 * @title DPattern.matchWithTaggedObjectOtherwise
 *
 * Router les tags explicitement traités et transmettre les variantes restantes au fallback.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Success extends DModeling.ObjectTag<"success"> { value: number }
interface Failure extends DModeling.ObjectTag<"failure"> { reason: string }
interface Pending extends DModeling.ObjectTag<"pending"> { task: string }
declare const outcome: Success | Failure | Pending;

// Appel direct : traiter certains noms ; le repli reçoit uniquement le reste.
const result = DPattern.matchWithTaggedObjectOtherwise(
	outcome,
	{
		success: (value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, Success, "strict">;
			return value.value;
		},
	},
	(value) => {
		type _CheckRemaining = DCommon.ExpectType<typeof value, Failure | Pending, "strict">;
		return value;
	},
);
// success produit son résultat ; les autres variantes fournissent leur objet complet.
type _CheckResult = DCommon.ExpectType<typeof result, number | Failure | Pending, "strict">;

// Appel curifié dans un pipe : le repli conserve le même affinement.
const piped = DCommon.pipe(
	outcome,
	DPattern.matchWithTaggedObjectOtherwise(
		{
			success: (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, Success, "strict">;
				return value.value;
			},
		},
		(value) => {
			type _CheckRemaining = DCommon.ExpectType<typeof value, Failure | Pending, "strict">;
			return value;
		},
	),
);
// success produit son résultat ; les autres variantes fournissent leur objet complet.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | Failure | Pending, "strict">;
