/**
 * @title DEither.whenIsRightOtherwise
 *
 * Traiter séparément les Right et les autres résultats.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", string>;

const direct = DEither.whenIsRightOtherwise(
	input,
	(value) => `right:${value}`,
	(value) => `left:${DEither.unwrapLeft(value)}`,
);
type _CheckDirect = DCommon.ExpectType<typeof direct, "right:saved" | `left:${string}`, "strict">;

// Appel curifié : les deux branches sont configurées avant l’entrée du pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenIsRightOtherwise(
		(value) => `right:${value}`,
		(value) => `left:${DEither.unwrapLeft(value)}`,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "right:saved" | `left:${string}`, "strict">;
