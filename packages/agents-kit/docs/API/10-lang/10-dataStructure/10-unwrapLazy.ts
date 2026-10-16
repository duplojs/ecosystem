/**
 * @title DDataStructure.unwrapLazy
 *
 * Résoudre une structure lazy et retourner la structure qu’elle contient.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const inner = DDataStructure.string();
const lazyStructure = DDataStructure.lazy(() => inner);
const structure = DDataStructure.unwrapLazy(lazyStructure);

type _CheckResult = DCommon.ExpectType<
	typeof structure,
	DDataStructure.Structure<string>,
	"strict"
>;
