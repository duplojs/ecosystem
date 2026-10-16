/**
 * @title DCommon.instanceOf
 *
 * Créer un prédicat basé sur un constructeur avec narrowing de l’instance.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: Date | string;
const result = DCommon.instanceOf(input, Date);

// Le test runtime produit un booléen.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée s’utilise directement comme predicate dans DCommon.when.
const preserved = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.instanceOf(Date),
		DCommon.forward,
	),
);

type _CheckPreserved = DCommon.ExpectType<typeof preserved, Date | string, "strict">;
