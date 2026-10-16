/**
 * @title DCommon.truthy
 *
 * Identifier les valeurs truthy et retirer les valeurs falsy de leur union.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | null;
const result = DCommon.truthy(input);

// Le predicate produit un booléen et peut affiner input vers une chaîne.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
