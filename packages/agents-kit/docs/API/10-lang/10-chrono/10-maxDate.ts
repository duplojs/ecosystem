/**
 * @title DChrono.maxDate
 *
 * Retourner la date la plus éloignée dans le futur parmi plusieurs dates.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

declare const dates: [DChrono.TheDate, DChrono.TheDate];
const latest = DChrono.maxDate(dates);

// La valeur obtenue est la date du 15 janvier.
type _CheckLatest = DCommon.ExpectType<typeof latest, DChrono.TheDate, "strict">;

// Les éléments peuvent être un mélange de TheDate et de dates sérialisées.
declare const mixedDates: [DChrono.TheDate | DChrono.SerializedTheDate, DChrono.TheDate | DChrono.SerializedTheDate];
const latestMixed = DChrono.maxDate(mixedDates);
type _CheckMixed = DCommon.ExpectType<typeof latestMixed, DChrono.TheDate, "strict">;

