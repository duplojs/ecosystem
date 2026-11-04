/**
 * @title DPath.createAbsolute
 *
 * Normaliser une chaîne et vérifier qu’elle représente un chemin absolu.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";

const result = DPath.createAbsolute("/workspace/src/../index.ts");
// Le Right contient /workspace/index.ts ; un chemin relatif produit un Left.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<string & DPath.Absolute & DPath.Path> | DEither.Error<string>,
	"strict"
>;

// Refus : un chemin relatif ne produit pas le chemin demandé.
const rejected = DPath.createAbsolute("src/index.ts");
// Error contient la chaîne d’origine, sans normalisation de sa valeur d’erreur.
type _CheckRejected = DCommon.ExpectType<typeof rejected, DEither.Success<string & DPath.Absolute & DPath.Path> | DEither.Error<string>, "strict">;
