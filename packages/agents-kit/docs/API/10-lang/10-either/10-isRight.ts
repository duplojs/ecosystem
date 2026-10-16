/**
 * @title DEither.isRight
 *
 * Vérifier le statut Right et affiner le type de la valeur.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;

if (DEither.isRight(input)) {
	// Dans cette branche, seul le Right reste possible.
	type _CheckInput = DCommon.ExpectType<typeof input, DEither.Success<"saved">, "strict">;
	const value = DEither.unwrapRight(input);
	type _CheckValue = DCommon.ExpectType<typeof value, "saved", "strict">;
}
