/**
 * @title DPattern.exhaustive
 *
 * Récupérer la valeur d’un résultat produit par le moteur de correspondance.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";

const handled = DPattern.result({
	status: "saved",
	id: 8,
});
const value = DPattern.exhaustive(handled);
// La valeur utile est récupérée sans le marqueur PatternResult.
type _CheckValue = DCommon.ExpectType<typeof value, {
	readonly status: "saved";
	readonly id: 8;
}, "strict">;
