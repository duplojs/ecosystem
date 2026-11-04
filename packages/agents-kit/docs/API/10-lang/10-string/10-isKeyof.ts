/**
 * @title DString.isKeyof
 *
 * Vérifier qu'une valeur est une clé de l'objet fourni et affiner son type.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const source = {
	name: "Alice",
	email: "alice@example.com",
} as const;
const result = DString.isKeyof("name", source);
// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const key: string;

const transformed = DCommon.pipe(
	key,
	DCommon.when(
		DString.isKeyof(source),
		(key) => {
			type _CheckKey = DCommon.ExpectType<typeof key, "name" | "email", "strict">;
			return DString.length(key);
		},
	),
);
// La branche vraie peut exploiter la clé réduite aux propriétés de l'objet.
type _CheckTransformed = DCommon.ExpectType<typeof transformed, string | (number & DNumber.Positive), "strict">;
