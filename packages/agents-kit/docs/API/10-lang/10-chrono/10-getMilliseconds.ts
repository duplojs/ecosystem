/**
 * @title DChrono.getMilliseconds
 *
 * Lire les millisecondes d’une date en UTC.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const date = DChrono.createDateOrThrow({
	value: "2021-01-15",
	hour: 12,
	minute: 34,
	second: 56,
	millisecond: 789,
});
const milliseconds = DChrono.getMilliseconds(date);

// La valeur obtenue est 789.
type _CheckMilliseconds = DCommon.ExpectType<typeof milliseconds, number, "strict">;

// Une date sérialisée est également acceptée.
const serialized = DChrono.getMilliseconds("date1609459200000+");
type _CheckSerialized = DCommon.ExpectType<typeof serialized, number, "strict">;

