/**
 * @title DEither.unwrapSelection
 *
 * Extraire les variantes marquées `true` dans une sélection et transmettre les autres.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;

// Appel classique : la variante success est extraite, la variante missing reste enveloppée.
const direct = DEither.unwrapSelection(input, {
	success: true,
	missing: false,
});
type _CheckDirect = DCommon.ExpectType<typeof direct, "saved" | DEither.Left<"missing", Error>, "strict">;

// Appel curifié : la sélection est appliquée dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.unwrapSelection({
		success: true,
		missing: false,
	}),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "saved" | DEither.Left<"missing", Error>, "strict">;
