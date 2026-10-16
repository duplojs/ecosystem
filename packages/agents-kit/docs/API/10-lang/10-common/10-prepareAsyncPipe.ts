/**
 * @title DCommon.prepareAsyncPipe
 *
 * Préparer une fabrique de pipelines asynchrones partageant une contrainte d’entrée.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const toUpperCase = DCommon.prepareAsyncPipe<string>()(
	DString.toUpperCase,
);

const result = toUpperCase("value");

// Le pipeline préparé accepte une chaîne et retourne une Promise de chaîne transformée.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<Uppercase<string>>,
	"strict"
>;
