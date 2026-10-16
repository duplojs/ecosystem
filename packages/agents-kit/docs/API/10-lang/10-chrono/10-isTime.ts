/**
 * @title DChrono.isTime
 *
 * Identifier si une valeur est une instance de TheTime et réduire son type.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const value: unknown = DChrono.createTimeOrThrow(90_000);
const isTime = DChrono.isTime(value);

// Le résultat indique si la valeur est une TheTime.
type _CheckResult = DCommon.ExpectType<typeof isTime, boolean, "strict">;

const notTime = DChrono.isTime(90_000);
// Un nombre brut n’est pas une TheTime et produit false.
type _CheckNotTime = DCommon.ExpectType<typeof notTime, boolean, "strict">;

if (DChrono.isTime(value)) {
	const timeValue = DChrono.toTimeValue(value);
	type _CheckNarrowed = DCommon.ExpectType<typeof timeValue, number, "strict">;
}

