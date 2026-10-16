/**
 * @title DChrono.yesterday
 *
 * Créer une TheDate correspondant au début du jour précédent en UTC.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const previousDay = DChrono.yesterday();

// La valeur dépend de l’horloge, mais représente le jour précédent à minuit UTC.
type _CheckPreviousDay = DCommon.ExpectType<typeof previousDay, DChrono.TheDate, "strict">;

