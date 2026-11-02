/**
 * @title DObject.getProperty
 *
 * Lire une propriété d’un objet en conservant son type.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

const source = {
	name: "Duplo",
	version: 1,
};
const result = DObject.getProperty(source, "name");

// La valeur obtenue est "Duplo".
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

const piped = DCommon.pipe(
	source,
	DObject.getProperty("version"),
);

// La forme curifiée lit version dans l’étape du pipe.
type _CheckPiped = DCommon.ExpectType<typeof piped, number, "strict">;
