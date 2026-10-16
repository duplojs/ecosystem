/**
 * @title DCommon.falsy
 *
 * Identifier les valeurs falsy JavaScript avec un narrowing TypeScript.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | null;
const result = DCommon.falsy(input);

// Le prédicat produit un booléen et distingue la branche falsy de l’union.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
