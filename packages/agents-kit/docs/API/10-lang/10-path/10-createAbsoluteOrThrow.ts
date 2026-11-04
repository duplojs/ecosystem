/**
 * @title DPath.createAbsoluteOrThrow
 *
 * Normaliser un chemin absolu ou lever une erreur si l’entrée est invalide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

// À la frontière d’exécution, choisir cette variante pour interrompre le programme
// sur un chemin invalide. Dans un traitement réutilisable, préférer createAbsolute.
const result = DPath.createAbsoluteOrThrow("/workspace/src/../index.ts");
// La valeur obtenue est /workspace/index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Absolute & DPath.Path, "strict">;

// Une entrée comme "src/index.ts" lève DPath.CreateAbsolutePathError,
// dont la propriété value conserve la chaîne d’origine.
