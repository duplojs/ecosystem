/**
 * @title DPattern.result
 *
 * Marquer une valeur comme résultat traité par un motif pour la distinguer de l’entrée restante.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";

const handled = DPattern.result({
	kind: "found",
	id: 42,
});
// Le résultat conserve le type littéral de l’objet dans son wrapper.
type _CheckHandled = DCommon.ExpectType<typeof handled, DPattern.PatternResult<{
	readonly kind: "found";
	readonly id: 42;
}>, "strict">;

// Le wrapper transporte la valeur sans la confondre avec une branche encore à examiner.
// La valeur extraite est { kind: "found", id: 42 }.
const unwrapped = DPattern.exhaustive(handled);
type _CheckUnwrapped = DCommon.ExpectType<typeof unwrapped, {
	readonly kind: "found";
	readonly id: 42;
}, "strict">;
