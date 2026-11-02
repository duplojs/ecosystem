/**
 * @title DObject.countKeys
 *
 * Compter les clés runtime d’un objet.
 */
import * as DObject from "@duplojs/lang/object";
import type * as DCommon from "@duplojs/lang/common";

const result = DObject.countKeys({
	name: "Duplo",
	version: 1,
});

// La valeur obtenue est 2.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;
