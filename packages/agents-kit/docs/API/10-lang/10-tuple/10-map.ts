/**
 * @title DTuple.map
 *
 * Transformer chaque élément d’un tuple en conservant sa cardinalité.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DTuple from "@duplojs/lang/tuple";

// L’index de chaque élément est disponible dans le contexte du callback.
const positions = DTuple.map(
	["draft", "ready"],
	(_value, { index }) => index,
);
// La valeur obtenue est [0, 1].
type _CheckPositions = DCommon.ExpectType<typeof positions, readonly [number, number], "strict">;

// La forme curifiée transforme les éléments dans un pipe, avant de les réunir.
declare const states: readonly ["draft", "ready"];
const key = DCommon.pipe(
	states,
	DTuple.map(DString.toUpperCase),
	DString.join("-"),
);
// La valeur obtenue est "DRAFT-READY".
// Le type conservateur combine toutes les chaînes produites pour chaque position.
type _CheckKey = DCommon.ExpectType<
	typeof key,
	"DRAFT-DRAFT" | "DRAFT-READY" | "READY-DRAFT" | "READY-READY",
	"strict"
>;

// Tuple à reste variable : le premier élément reste garanti après transformation.
declare const names: readonly [string, ...string[]];
const upperNames = DTuple.map(names, DString.toUpperCase);
// Chaque nom est converti en majuscules ; au moins une position est conservée.
type _CheckUpperNames = DCommon.ExpectType<typeof upperNames, readonly [Uppercase<string>, ...Uppercase<string>[]], "strict">;
