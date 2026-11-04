/**
 * @title DPath.createOrThrow
 *
 * Normaliser un chemin ou lever une erreur si l’entrée est invalide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

// À la frontière d’exécution, choisir cette variante pour interrompre le programme
// sur un chemin invalide. Dans un traitement réutilisable, préférer create.
const result = DPath.createOrThrow("src//module/../index.ts");
// La valeur obtenue est src/index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Path, "strict">;

// Une entrée comme "invalid\0path" lève DPath.CreatePathError,
// dont la propriété value conserve la chaîne d’origine.
