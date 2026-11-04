/**
 * @title DObject.isSimple
 *
 * Identifier les objets simples utilisables comme enregistrements de propriétés.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

declare const input: object | string;
const result = DObject.isSimple(input);

// Le test runtime produit un booléen.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

if (DObject.isSimple(input)) {
	type _CheckInput = DCommon.ExpectType<typeof input, object, "strict">;

	const count = DObject.countKeys(input);

	// Dans cette branche, input est reconnu comme un objet et son nombre de clés est calculé.
	type _CheckCount = DCommon.ExpectType<typeof count, number, "strict">;
}

// Le predicate unaire peut aussi être donné directement à DCommon.when.
const keyCount = DCommon.pipe(
	input,
	DCommon.when(
		DObject.isSimple,
		(simpleObject) => {
			type _CheckObject = DCommon.ExpectType<typeof simpleObject, object, "strict">;

			return DObject.countKeys(simpleObject);
		},
	),
);
// Si le predicate échoue, le pipe conserve les valeurs primitives possibles.
type _CheckKeyCount = DCommon.ExpectType<
	typeof keyCount,
	string | number | bigint | boolean | symbol | null | undefined,
	"strict"
>;
