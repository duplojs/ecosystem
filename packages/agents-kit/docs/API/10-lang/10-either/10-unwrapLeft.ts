/**
 * @title DEither.unwrapLeft
 *
 * Extraire la valeur d’un Left et laisser les autres valeurs inchangées.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const leftValue = DEither.unwrapLeft(DEither.left("invalid", "bad-input"));
type _CheckLeft = DCommon.ExpectType<typeof leftValue, "bad-input", "strict">;

const rightValue = DEither.unwrapLeft(DEither.success("saved"));
// Un Right n’est pas extrait et reste présent dans la sortie.
type _CheckRight = DCommon.ExpectType<typeof rightValue, DEither.Success<"saved">, "strict">;
