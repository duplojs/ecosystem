/**
 * @title DChrono.today
 *
 * Créer une TheDate correspondant au début du jour courant en UTC.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const currentDay = DChrono.today();

// La valeur dépend de la date courante, mais son heure UTC est ramenée à minuit.
type _CheckCurrentDay = DCommon.ExpectType<typeof currentDay, DChrono.TheDate, "strict">;

