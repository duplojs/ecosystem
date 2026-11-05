/**
 * @title DPattern.matchWithFactOtherwise
 *
 * Router les facts choisis et traiter les autres noms avec un callback recevant le fact restant.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Created extends DModeling.Fact<"Created", { title: string }> {}
interface Deleted extends DModeling.Fact<"Deleted", { reason: string }> {}
interface Renamed extends DModeling.Fact<"Renamed", { title: string }> {}
declare const event: Created | Deleted | Renamed;

// Appel direct : traiter certains noms ; le repli reçoit uniquement le reste.
const result = DPattern.matchWithFactOtherwise(
	event,
	{
		Created: (value, payload) => {
			type _CheckValue = DCommon.ExpectType<typeof value, Created, "strict">;
			return payload.title;
		},
	},
	(value) => {
		type _CheckRemaining = DCommon.ExpectType<typeof value, Deleted | Renamed, "strict">;
		return value;
	},
);
// Created produit son résultat ; les autres variantes fournissent leur valeur complète.
type _CheckResult = DCommon.ExpectType<typeof result, string | Deleted | Renamed, "strict">;

// Appel curifié dans un pipe : le repli conserve le même affinement.
const piped = DCommon.pipe(
	event,
	DPattern.matchWithFactOtherwise(
		{
			Created: (value, payload) => {
				type _CheckValue = DCommon.ExpectType<typeof value, Created, "strict">;
				return payload.title;
			},
		},
		(value) => {
			type _CheckRemaining = DCommon.ExpectType<typeof value, Deleted | Renamed, "strict">;
			return value;
		},
	),
);
// Created produit son résultat ; les autres variantes fournissent leur valeur complète.
type _CheckPiped = DCommon.ExpectType<typeof piped, string | Deleted | Renamed, "strict">;
