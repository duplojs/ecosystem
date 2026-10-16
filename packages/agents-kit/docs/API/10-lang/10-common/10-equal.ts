/**
 * @title DCommon.equal
 *
 * Créer un prédicat d’égalité pour une valeur ou une liste de valeurs littérales.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

// Appel classique : comparer immédiatement deux valeurs.
const result = DCommon.equal("value", "value");

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

declare const source: string | number;

// Appel curifié : le prédicat est passé directement à DCommon.when.
const transformed = DCommon.pipe(
	source,
	DCommon.when(
		DCommon.equal("value"),
		DString.toUpperCase,
	),
);

// La chaîne est transformée si elle vaut "value", sinon la source est conservée.
type _CheckTransformed = DCommon.ExpectType<
	typeof transformed,
	number | string,
	"strict"
>;
