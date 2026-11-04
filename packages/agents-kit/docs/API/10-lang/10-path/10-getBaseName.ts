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

// Sans option, le nom conserve toutes ses extensions.
const fullName = DPath.getBaseName(path);
// La valeur obtenue est index.test.ts.
type _CheckFullName = DCommon.ExpectType<typeof fullName, (string & DPath.Segment & DPath.Path) | null, "strict">;

// La racine ne possède pas de dernier segment.
const rootName = DPath.getBaseName(DPath.declareAbsolutePath("/"));
// La valeur obtenue est null ; le type de retour reste l’union générale.
type _CheckRootName = DCommon.ExpectType<typeof rootName, (string & DPath.Segment & DPath.Path) | null, "strict">;
