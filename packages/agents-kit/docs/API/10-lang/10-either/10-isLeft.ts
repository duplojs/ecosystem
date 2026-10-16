/**
 * @title DEither.isLeft
 *
 * Vérifier le statut Left et affiner le type de la valeur.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;

if (DEither.isLeft(input)) {
	// Dans cette branche, seul le Left reste possible.
	type _CheckInput = DCommon.ExpectType<typeof input, DEither.Left<"missing", Error>, "strict">;
	const value = DEither.unwrapLeft(input);
	type _CheckValue = DCommon.ExpectType<typeof value, Error, "strict">;
}
