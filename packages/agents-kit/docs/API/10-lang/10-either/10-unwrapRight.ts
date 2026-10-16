/**
 * @title DEither.unwrapRight
 *
 * Extraire la valeur d’un Right et laisser les autres valeurs inchangées.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const rightValue = DEither.unwrapRight(DEither.success("saved"));
type _CheckRight = DCommon.ExpectType<typeof rightValue, "saved", "strict">;

const leftValue = DEither.unwrapRight(DEither.left("missing", "not-found"));
// Un Left n’est pas extrait et reste présent dans la sortie.
type _CheckLeft = DCommon.ExpectType<typeof leftValue, DEither.Left<"missing", "not-found">, "strict">;
