/**
 * @title DEither.none
 *
 * Créer le Left représentant l’absence d’une valeur.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const result = DEither.none();

// La sortie est `None`, un Left dont la valeur est `null`.
type _CheckResult = DCommon.ExpectType<typeof result, DEither.None, "strict">;
