/**
 * @title DPath.create
 *
 * Normaliser une chaîne et retourner un Either selon qu’elle forme un chemin valide.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";

const result = DPath.create("src//module/../index.ts");
// Le Right contient src/index.ts ; un chemin invalide produit un Left contenant l’entrée.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<string & DPath.Path> | DEither.Error<string>,
	"strict"
>;
