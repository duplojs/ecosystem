/**
 * @title DObject.transformProperties
 *
 * Transformer plusieurs propriétés d’un objet en conservant les autres.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const source = {
	name: "duplo",
	version: 1,
};
const result = DObject.transformProperties(source, {
	name: DString.toUpperCase,
});

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
	DObject.transformProperties({
		name: DString.toUpperCase,
	}),
);

// La forme curifiée place la description des transformations dans l’étape du pipe.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		name: Uppercase<string>;
		version: number;
	},
	"strict"
>;
