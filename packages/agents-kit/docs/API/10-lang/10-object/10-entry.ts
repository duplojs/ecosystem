/**
 * @title DObject.entry
 *
 * Construire une entrée objet en conservant les types de sa clé et de sa valeur.
 */
import * as DObject from "@duplojs/lang/object";
import type * as DCommon from "@duplojs/lang/common";

const result = DObject.entry("name", "Duplo" as const);

// La valeur obtenue est l’entrée readonly ["name", "Duplo"].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly ["name", "Duplo"],
	"strict"
>;
