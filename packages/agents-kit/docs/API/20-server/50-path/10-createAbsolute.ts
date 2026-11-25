/**
 * @title DSPath.createAbsolute
 *
 * Normaliser un chemin de plateforme et vérifier qu'il est absolu.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

const result = DSPath.createAbsolute("/workspace/../index.ts");
// Hors Windows : Success contient "/index.ts" ; sur Windows, le lecteur courant
// est ajouté et son indisponibilité peut provoquer un Left.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<string & DPath.Absolute & DPath.Path> | DEither.Left<"create-absolute-path-error", string>,
	"strict"
>;

