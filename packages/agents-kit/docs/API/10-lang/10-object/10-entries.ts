/**
 * @title DObject.entries
 *
 * Convertir les propriétés d’un objet en entrées typées.
 */
import * as DObject from "@duplojs/lang/object";
import type * as DCommon from "@duplojs/lang/common";

const result = DObject.entries({
	name: "Duplo",
	version: 1,
});

// La valeur obtenue contient les couples ["name", string] et ["version", number].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly (readonly ["name", string] | readonly ["version", number])[],
	"strict"
>;
