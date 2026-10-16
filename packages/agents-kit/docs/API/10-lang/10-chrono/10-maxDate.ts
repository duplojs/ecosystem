/**
 * @title DChrono.maxDate
 *
 * Retourner la date la plus éloignée dans le futur parmi plusieurs dates.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const latest = DChrono.maxDate([
	DChrono.createDate("2021-01-01"),
	DChrono.createDate("2021-01-15"),
] as const);

// La valeur obtenue est la date du 15 janvier.
type _CheckLatest = DCommon.ExpectType<typeof latest, DChrono.TheDate, "strict">;

// Les éléments peuvent être un mélange de TheDate et de dates sérialisées.
const latestMixed = DChrono.maxDate([
	"date1609459200000+",
	DChrono.createDate("2021-01-15"),
] as const);
type _CheckMixed = DCommon.ExpectType<typeof latestMixed, DChrono.TheDate, "strict">;

