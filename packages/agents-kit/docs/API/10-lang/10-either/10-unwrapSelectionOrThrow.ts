/**
 * @title DEither.unwrapSelectionOrThrow
 *
 * Extraire une variante sélectionnée ou lever une exception lorsqu’elle ne l’est pas.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const direct = DEither.unwrapSelectionOrThrow(DEither.success("saved"), { success: true });
type _CheckDirect = DCommon.ExpectType<typeof direct, "saved", "strict">;

// Appel curifié : la sélection est configurée avant l’entrée du pipe.
const piped = DCommon.pipe(
	DEither.success("saved"),
	DEither.unwrapSelectionOrThrow({ success: true }),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "saved", "strict">;

// Une information associée à `false` provoque `HasNotSelectedInformationError` au runtime.
