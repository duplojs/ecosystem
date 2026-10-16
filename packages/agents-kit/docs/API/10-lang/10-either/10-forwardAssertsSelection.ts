/**
 * @title DEither.forwardAssertsSelection
 *
 * Affirmer qu’une information est sélectionnée et lever une exception sinon.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.success("saved") as DEither.Success<"saved"> | DEither.Left<"missing", Error>;

// Appel classique : le type est réduit aux informations sélectionnées.
const direct = DEither.forwardAssertsSelection(input, {
	success: true,
	missing: false,
});
type _CheckDirect = DCommon.ExpectType<typeof direct, DEither.Success<"saved">, "strict">;

// Appel curifié : l’affirmation est placée dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.forwardAssertsSelection({
		success: true,
		missing: false,
	}),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DEither.Success<"saved">, "strict">;

// Une information marquée `false` provoque `ForwardAssertsSelectionError` au runtime.
