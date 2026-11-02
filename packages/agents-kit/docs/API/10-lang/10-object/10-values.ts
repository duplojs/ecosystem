/**
 * @title DObject.values
 *
 * Extraire les valeurs d’un objet avec l’union des types de ses propriétés.
 */
import * as DObject from "@duplojs/lang/object";
import type * as DCommon from "@duplojs/lang/common";

const result = DObject.values({
	name: "Duplo",
	version: 1,
});

// La valeur obtenue est ["Duplo", 1] et son type contient string | number.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly (string | number)[],
	"strict"
>;
