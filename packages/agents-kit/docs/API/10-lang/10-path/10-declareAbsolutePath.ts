/**
 * @title DPath.declareAbsolutePath
 *
 * Déclarer un littéral de chemin comme chemin absolu après vérification statique.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const path = DPath.declareAbsolutePath("/workspace/src/index.ts");
// Le littéral conserve sa valeur et reçoit les contraintes Absolute et Path.
type _CheckPath = DCommon.ExpectType<typeof path, "/workspace/src/index.ts" & DPath.Absolute & DPath.Path, "strict">;

// La déclaration ne normalise ni ne valide au runtime ; elle exige un littéral valide.
// @ts-expect-error Le littéral ne satisfait pas le contrat de cette déclaration.
DPath.declareAbsolutePath("src/index.ts");
