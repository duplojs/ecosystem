/**
 * @title DCommon.createInterpolation
 *
 * Préparer une fonction qui remplace les identifiants entre accolades dans un modèle.
 */
import * as DCommon from "@duplojs/lang/common";

const interpolation = DCommon.createInterpolation("user-{id}", true);
const result = interpolation({ id: "42" });

// Le mode strict reflète la valeur injectée dans le type de sortie.
type _CheckResult = DCommon.ExpectType<typeof result, "user-42", "strict">;
