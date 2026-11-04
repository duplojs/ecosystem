/**
 * @title DPath.isAbsolute
 *
 * Vérifier qu’une chaîne est un chemin absolu et affiner son type.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

declare const value: string;

if (DPath.isAbsolute(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Absolute, "strict">;
}

const path = DPath.isAbsolute("/workspace/src");
// Le test runtime produit true.
type _CheckPath = DCommon.ExpectType<typeof path, boolean, "strict">;

const parent = DCommon.pipe(
	value,
	DCommon.when(
		DPath.isAbsolute,
		(absolutePath) => {
			type _CheckAbsolutePath = DCommon.ExpectType<typeof absolutePath, string & DPath.Absolute, "strict">;

			return DPath.getParentFolderPath(absolutePath);
		},
	),
);
// Un chemin absolu donne son dossier parent ; les autres chaînes restent inchangées.
type _CheckParent = DCommon.ExpectType<
	typeof parent,
	string | (string & DPath.Path & DPath.Absolute) | null,
	"strict"
>;
