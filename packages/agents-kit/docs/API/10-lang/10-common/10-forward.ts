/**
 * @title DCommon.forward
 *
 * Retourner une valeur telle quelle pour la rendre explicite dans une composition.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.forward("value");

// La valeur et son type sont conservés.
type _CheckResult = DCommon.ExpectType<typeof result, "value", "strict">;
