/**
 * @title DObject.omit
 *
 * Créer un objet en retirant les propriétés sélectionnées.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

const source = {
	name: "Duplo",
	version: 1,
	active: true,
};
const result = DObject.omit(source, ["version"]);

// La valeur obtenue est { name: "Duplo", active: true }.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	{
		name: string;
		active: boolean;
	},
	"strict"
>;

const piped = DCommon.pipe(
	source,
	DObject.omit({ active: true }),
);

// Une sélection par objet de drapeaux est également utilisable dans un pipe.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		name: string;
		version: number;
	},
	"strict"
>;
