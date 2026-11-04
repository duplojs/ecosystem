/**
 * @title DChrono.minDate
 *
 * Retourner la date la plus éloignée dans le passé parmi plusieurs dates.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

declare const dates: [DChrono.TheDate, DChrono.TheDate];
const earliest = DChrono.minDate(dates);

// La valeur obtenue est la date du 1er janvier.
type _CheckEarliest = DCommon.ExpectType<typeof earliest, DChrono.TheDate, "strict">;

// Les éléments peuvent être un mélange de TheDate et de dates sérialisées.
declare const mixedDates: [DChrono.TheDate | DChrono.SerializedTheDate, DChrono.TheDate | DChrono.SerializedTheDate];
const earliestMixed = DChrono.minDate(mixedDates);
type _CheckMixed = DCommon.ExpectType<typeof earliestMixed, DChrono.TheDate, "strict">;

