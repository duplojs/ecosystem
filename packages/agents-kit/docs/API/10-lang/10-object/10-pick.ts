/**
 * @title DObject.pick
 *
 * Créer un objet avec les propriétés sélectionnées.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

const source = {
	name: "Duplo",
	version: 1,
	active: true,
};
const result = DObject.pick(source, ["name", "active"]);

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
	DObject.pick({
		name: true,
		version: false,
	}),
);

// Une sélection par objet de drapeaux conserve seulement name.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		name: string;
	},
	"strict"
>;
