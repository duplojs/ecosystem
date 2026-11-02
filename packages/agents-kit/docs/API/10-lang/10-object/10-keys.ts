/**
 * @title DObject.keys
 *
 * Lister les clés d’un objet avec un type correspondant à ses propriétés.
 */
import * as DObject from "@duplojs/lang/object";
import type * as DCommon from "@duplojs/lang/common";

const result = DObject.keys({
	name: "Duplo",
	version: 1,
});

// La valeur obtenue est ["name", "version"] et ses clés sont conservées dans le type.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	readonly ("name" | "version")[],
	"strict"
>;
