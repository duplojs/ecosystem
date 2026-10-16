/**
 * @title DCommon.createTransformer
 *
 * Créer une fonction de transformation récursive liée à un nom de méthode.
 */
import * as DCommon from "@duplojs/lang/common";

const toNative = DCommon.createTransformer("toNative");
const result = toNative({
	toNative() {
		return 42 as const;
	},
});

// Le transformer appelle la méthode ciblée et retourne sa valeur.
type _CheckResult = DCommon.ExpectType<typeof result, 42, "strict">;
