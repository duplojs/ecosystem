/**
 * @title DEither.success
 *
 * Créer un Right standardisé avec l’information `success`.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const result = DEither.success("saved");

// La sortie est un Success conservant le type littéral de la valeur.
type _CheckResult = DCommon.ExpectType<typeof result, DEither.Success<"saved">, "strict">;
