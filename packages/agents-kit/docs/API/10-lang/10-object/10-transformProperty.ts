/**
 * @title DObject.transformProperty
 *
 * Transformer une propriété précise d’un objet.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const source = {
	name: "duplo",
	version: 1,
};
const result = DObject.transformProperty(source, "name", DString.toUpperCase);

// La valeur obtenue est { name: "DUPLO", version: 1 }.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	{
		name: Uppercase<string>;
		version: number;
	},
	"strict"
>;

const piped = DCommon.pipe(
	source,
	DObject.transformProperty("name", DString.toUpperCase),
);

// La forme curifiée ne remplace que la propriété ciblée.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		name: Uppercase<string>;
		version: number;
	},
	"strict"
>;
