/**
 * @title DCommon.forwardAsserts
 *
 * Vérifier une valeur et la retourner, ou produire une fonction réutilisable de vérification.
 */
import * as DCommon from "@duplojs/lang/common";

// Appel classique : vérifier et retourner immédiatement la valeur.
const result = DCommon.forwardAsserts("value", DCommon.isType("string"));

type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

// Appel curifié : préparer une vérification réutilisable.
const ensureString = DCommon.forwardAsserts(DCommon.isType("string"));
const checked = ensureString("value");

type _CheckChecked = DCommon.ExpectType<typeof checked, string, "strict">;
