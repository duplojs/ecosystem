/**
 * @title DSPath.createAbsoluteOrThrow
 *
 * Normaliser un chemin absolu de plateforme ou lever une erreur.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

const path = DSPath.createAbsoluteOrThrow("/workspace/index.ts");
// Hors Windows : "/workspace/index.ts". Sur Windows : le lecteur courant est
// ajouté ; une entrée invalide ou relative lève CreateAbsolutePathError avec value.
// Préférer createAbsolute lorsque le refus doit être propagé.
type _CheckPath = DCommon.ExpectType<
	typeof path,
	string & DPath.Absolute & DPath.Path,
	"strict"
>;
