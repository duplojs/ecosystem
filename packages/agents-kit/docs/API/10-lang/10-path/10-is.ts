/**
 * @title DPath.is
 *
 * Vérifier qu’une chaîne respecte la syntaxe d’un chemin et affiner son type.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

declare const value: string;

if (DPath.is(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Path, "strict">;
}

const path = DPath.is("src/index.ts");
// Le test runtime produit true.
type _CheckPath = DCommon.ExpectType<typeof path, boolean, "strict">;

const baseName = DCommon.pipe(
	value,
	DCommon.when(
		DPath.is,
		(validPath) => {
			type _CheckValidPath = DCommon.ExpectType<typeof validPath, string & DPath.Path, "strict">;

			return DPath.getBaseName(validPath);
		},
	),
);
// Un chemin valide donne son nom de base ; un chemin invalide reste la chaîne d’origine.
type _CheckBaseName = DCommon.ExpectType<
	typeof baseName,
	string | (string & DPath.Segment & DPath.Path) | null,
	"strict"
>;
