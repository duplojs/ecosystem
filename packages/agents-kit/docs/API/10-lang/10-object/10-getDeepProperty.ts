/**
 * @title DObject.getDeepProperty
 *
 * Lire une propriété imbriquée avec un chemin vérifié par TypeScript.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

const source = {
	profile: {
		name: "Duplo",
	},
};

const result = DObject.getDeepProperty(source, "profile.name");

// La valeur obtenue est "Duplo".
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

const piped = DCommon.pipe(
	source,
	DObject.getDeepProperty("profile.name"),
);

// Le chemin curifié lit la même propriété dans un pipe.
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
