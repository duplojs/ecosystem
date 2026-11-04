/**
 * @title DPath.createSegmentOrThrow
 *
 * Normaliser un segment ou lever une erreur si l’entrée n’est pas un segment valide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

// À la frontière d’exécution, choisir cette variante pour interrompre le programme
// sur un chemin invalide. Dans un traitement réutilisable, préférer createSegment.
const result = DPath.createSegmentOrThrow("index.ts");
// La valeur obtenue est index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Segment & DPath.Path, "strict">;

// Une entrée comme "src/index.ts" lève DPath.CreateSegmentPathError,
// dont la propriété value conserve la chaîne d’origine.
