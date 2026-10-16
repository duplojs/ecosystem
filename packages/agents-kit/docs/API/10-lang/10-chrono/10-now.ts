/**
 * @title DChrono.now
 *
 * Créer une TheDate représentant l’instant courant.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";

const current = DChrono.now();

// La valeur dépend de l’horloge au moment de l’appel, mais reste une TheDate.
type _CheckCurrent = DCommon.ExpectType<typeof current, DChrono.TheDate, "strict">;

