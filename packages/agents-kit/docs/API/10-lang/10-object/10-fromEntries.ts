/**
 * @title DObject.fromEntries
 *
 * Reconstruire un objet typé à partir d’une collection d’entrées.
 */
import * as DObject from "@duplojs/lang/object";
import type * as DCommon from "@duplojs/lang/common";

const entries = [
	DObject.entry("name", "Duplo"),
	DObject.entry("version", 1),
] as const;
const result = DObject.fromEntries(entries);

// La valeur obtenue est un objet dont les propriétés name et version sont optionnelles dans le type inféré.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	{
		name?: string;
		version?: number;
	},
	"strict"
>;
