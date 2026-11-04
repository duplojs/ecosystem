/**
 * @title DChrono.isDate
 *
 * Identifier si une valeur est une instance de TheDate et réduire son type.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const value: DCommon.AnyValue = DChrono.createDate("2021-01-15");
const isDate = DChrono.isDate(value);

// Le résultat indique si la valeur est une TheDate.
type _CheckResult = DCommon.ExpectType<typeof isDate, boolean, "strict">;

const notDate = DChrono.isDate(new Date("2021-01-15T00:00:00.000Z"));
// Une Date native n’est pas une TheDate et produit false.
type _CheckNotDate = DCommon.ExpectType<typeof notDate, boolean, "strict">;

if (DChrono.isDate(value)) {
	const timestamp = DChrono.toTimestamp(value);
	type _CheckNarrowed = DCommon.ExpectType<typeof timestamp, number, "strict">;
}

// Le predicate unaire peut aussi établir TheDate dans le callback d’un pipe.
const timestamp = DCommon.pipe(
	value,
	DCommon.when(
		DChrono.isDate,
		(date) => {
			type _CheckDate = DCommon.ExpectType<typeof date, DChrono.TheDate, "strict">;

			return DChrono.toTimestamp(date);
		},
	),
);
type _CheckTimestamp = DCommon.ExpectType<typeof timestamp, DCommon.AnyValue, "strict">;
