/**
 * @title DEither.whenIsSelected
 *
 * Transformer la valeur des variantes marquées `true` dans une sélection.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Left<"invalid", string> | DEither.Success<"saved">;

// Appel classique : seule la variante invalid est transformée.
const direct = DEither.whenIsSelected(
	input,
	{
		invalid: true,
		success: false,
	},
	(value) => `invalid:${value}`,
);
type _CheckDirect = DCommon.ExpectType<typeof direct, `invalid:${string}` | DEither.Success<"saved">, "strict">;

// Appel curifié : la sélection et la callback sont configurées dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenIsSelected(
		{
			invalid: true,
			success: false,
		},
		(value) => `invalid:${value}`,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, `invalid:${string}` | DEither.Success<"saved">, "strict">;
