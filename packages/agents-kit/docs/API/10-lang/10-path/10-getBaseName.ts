/**
 * @title DPath.getBaseName
 *
 * Lire le dernier segment d’un chemin, avec la possibilité d’en retirer l’extension.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const path = DPath.declarePath("src/index.test.ts");
const result = DPath.getBaseName(path, { removeExtension: true });
// La valeur obtenue est index.test ; null indique un chemin sans nom de base.
type _CheckResult = DCommon.ExpectType<typeof result, (string & DPath.Segment & DPath.Path) | null, "strict">;
