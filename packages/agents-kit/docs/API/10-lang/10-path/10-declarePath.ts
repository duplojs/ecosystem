/**
 * @title DPath.declarePath
 *
 * Déclarer un littéral valide comme chemin après vérification statique.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const path = DPath.declarePath("src/index.ts");
// Le littéral conserve sa valeur et reçoit la contrainte Path.
type _CheckPath = DCommon.ExpectType<typeof path, "src/index.ts" & DPath.Path, "strict">;

// La déclaration ne normalise ni ne valide au runtime ; elle exige un littéral valide.
// @ts-expect-error Le littéral ne satisfait pas le contrat de cette déclaration.
DPath.declarePath("src//index.ts");
