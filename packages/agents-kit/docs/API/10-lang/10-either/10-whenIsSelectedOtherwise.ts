/**
 * @title DEither.whenIsSelectedOtherwise
 *
 * Transformer les variantes sélectionnées et traiter toutes les autres dans une branche de repli.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Left<"invalid", string> | DEither.Success<"saved">;

// Appel classique : la branche otherwise reçoit le Right non sélectionné.
const direct = DEither.whenIsSelectedOtherwise(
	input,
	{
		invalid: true,
		success: false,
	},
	(value) => `invalid:${value}`,
	(value) => DEither.unwrapRight(value),
);
type _CheckDirect = DCommon.ExpectType<typeof direct, `invalid:${string}` | "saved", "strict">;

// Appel curifié : la sélection et les deux callbacks sont configurées dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenIsSelectedOtherwise(
		{
			invalid: true,
			success: false,
		},
		(value) => `invalid:${value}`,
		(value) => DEither.unwrapRight(value),
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, `invalid:${string}` | "saved", "strict">;
