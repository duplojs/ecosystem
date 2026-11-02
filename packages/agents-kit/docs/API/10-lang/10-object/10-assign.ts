/**
 * @title DObject.assign
 *
 * Fusionner les propriétés d’un objet dans une nouvelle valeur.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

const source = {
	id: 1,
	name: "Duplo",
};
const result = DObject.assign(source, { active: true });

// La valeur obtenue est { id: 1, name: "Duplo", active: true }.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	{
		id: number;
		name: string;
		active: boolean;
	},
	"strict"
>;

// La forme curifiée s’utilise comme étape de transformation.
const piped = DCommon.pipe(
	source,
	DObject.assign({ active: true }),
);

// La valeur obtenue contient les mêmes propriétés fusionnées.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		id: number;
		name: string;
		active: boolean;
	},
	"strict"
>;
