/**
 * @title DCommon.escapeRegExp
 *
 * Échapper les caractères spéciaux d’une chaîne avant de l’utiliser dans une expression régulière.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.escapeRegExp("file.name");

// Le point est échappé pour être interprété littéralement.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
