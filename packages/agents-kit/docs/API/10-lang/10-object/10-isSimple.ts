/**
 * @title DObject.isSimple
 *
 * Identifier les objets simples utilisables comme enregistrements de propriétés.
 */
import * as DObject from "@duplojs/lang/object";
import type * as DCommon from "@duplojs/lang/common";

declare const input: unknown;
const result = DObject.isSimple(input);

// Le test runtime produit un booléen.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

if (DObject.isSimple(input)) {
	type _CheckInput = DCommon.ExpectType<typeof input, object, "strict">;

	const count = DObject.countKeys(input);

	// Dans cette branche, input est reconnu comme un objet et son nombre de clés est calculé.
	type _CheckCount = DCommon.ExpectType<typeof count, number, "strict">;
}
