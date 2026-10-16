/**
 * @title DChrono.minDate
 *
 * Retourner la date la plus éloignée dans le passé parmi plusieurs dates.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const earliest = DChrono.minDate([
	DChrono.createDate("2021-01-15"),
	DChrono.createDate("2021-01-01"),
] as const);

// La valeur obtenue est la date du 1er janvier.
type _CheckEarliest = DCommon.ExpectType<typeof earliest, DChrono.TheDate, "strict">;

// Les éléments peuvent être un mélange de TheDate et de dates sérialisées.
const earliestMixed = DChrono.minDate([
	"date1609459200000+",
	DChrono.createDate("2021-01-15"),
] as const);
type _CheckMixed = DCommon.ExpectType<typeof earliestMixed, DChrono.TheDate, "strict">;

