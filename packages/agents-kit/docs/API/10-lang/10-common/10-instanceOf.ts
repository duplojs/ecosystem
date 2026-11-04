/**
 * @title DCommon.instanceOf
 *
 * Créer un prédicat basé sur un constructeur avec narrowing de l’instance.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DChrono from "@duplojs/lang/chrono";

declare const input: Date | string;
const result = DCommon.instanceOf(input, Date);

// Le test runtime produit un booléen.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

if (DCommon.instanceOf(input, Date)) {
	type _CheckInput = DCommon.ExpectType<typeof input, Date, "strict">;
	const chronoDate = DChrono.createDateOrThrow(input);
	type _CheckChronoDate = DCommon.ExpectType<typeof chronoDate, DChrono.TheDate, "strict">;
}

// La forme curifiée s’utilise directement comme predicate dans DCommon.when.
const converted = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.instanceOf(Date),
		(date) => {
			type _CheckDate = DCommon.ExpectType<typeof date, Date, "strict">;

			return DChrono.createDateOrThrow(date);
		},
	),
);

type _CheckConverted = DCommon.ExpectType<typeof converted, DChrono.TheDate | string, "strict">;
