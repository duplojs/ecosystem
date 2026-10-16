/**
 * @title DCommon.preparePipe
 *
 * Préparer une fabrique de pipelines partageant une contrainte d’entrée.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const toUpperCase = DCommon.preparePipe<string>()(
	DString.toUpperCase,
);

const result = toUpperCase("value");

// Le pipeline préparé conserve le type de sa transformation.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Uppercase<string>,
	"strict"
>;
