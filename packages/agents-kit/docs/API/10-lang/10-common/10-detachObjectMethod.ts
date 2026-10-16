/**
 * @title DCommon.detachObjectMethod
 *
 * Détacher une méthode d’un objet tout en conservant son contexte d’exécution.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const source = {
	value: "value",
	upper() {
		return DString.toUpperCase(this.value);
	},
};

const upper = DCommon.detachObjectMethod(source, "upper");
const result = upper();

// La méthode détachée utilise toujours source comme contexte.
type _CheckResult = DCommon.ExpectType<typeof result, Uppercase<string>, "strict">;
