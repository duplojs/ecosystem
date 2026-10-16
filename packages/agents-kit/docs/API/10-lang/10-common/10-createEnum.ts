/**
 * @title DCommon.createEnum
 *
 * Créer un enum littéral qui expose ses valeurs, un tuple et un prédicat `has`.
 */
import * as DCommon from "@duplojs/lang/common";

const status = DCommon.createEnum([
	"pending",
	"done",
]);
const result = status.toTuple();

// Le tuple conserve les valeurs littérales et leur ordre.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly ["pending", "done"],
	"strict"
>;

declare const input: "pending" | "done" | "missing";
if (status.has(input)) {
	// Le predicate has affine l’union vers les valeurs de l’enum.
	type _CheckInput = DCommon.ExpectType<typeof input, "pending" | "done", "strict">;
}
