/**
 * @title DEither.keepAsRightSelection
 *
 * Reclasser les variantes selon une sélection exhaustive d’informations.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.left("validated", "Alice");

// Appel classique : la variante sélectionnée devient Right.
const direct = DEither.keepAsRightSelection(input, { validated: true });
type _CheckDirect = DCommon.ExpectType<typeof direct, DEither.Right<"validated", "Alice">, "strict">;

// Appel curifié : la sélection est placée dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.keepAsRightSelection({ validated: true }),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DEither.Right<"validated", "Alice">, "strict">;

const rejected = DEither.keepAsRightSelection(DEither.success("saved"), { success: false } as const);
type _CheckRejected = DCommon.ExpectType<typeof rejected, DEither.Left<"success", "saved">, "strict">;
