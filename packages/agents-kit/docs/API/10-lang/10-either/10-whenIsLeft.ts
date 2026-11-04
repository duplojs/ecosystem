/**
 * @title DEither.whenIsLeft
 *
 * Transformer la valeur d’un Left et transmettre les autres résultats inchangés.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.left("invalid", "bad-input");

// Appel classique : la callback ne reçoit que la valeur du Left.
const direct = DEither.whenIsLeft(input, (value) => `reason:${value}`);
type _CheckDirect = DCommon.ExpectType<typeof direct, "reason:bad-input", "strict">;

// Appel curifié : la transformation est directement placée dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenIsLeft((value) => `reason:${value}`),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "reason:bad-input", "strict">;
