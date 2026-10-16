/**
 * @title DChrono.tomorrow
 *
 * Créer une TheDate correspondant au début du jour suivant en UTC.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const nextDay = DChrono.tomorrow();

// La valeur dépend de l’horloge, mais représente le jour suivant à minuit UTC.
type _CheckNextDay = DCommon.ExpectType<typeof nextDay, DChrono.TheDate, "strict">;

