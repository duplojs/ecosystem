/**
 * @title DEither.whenIsRightOtherwise
 *
 * Traiter séparément les Right et les autres résultats.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.success("saved") as DEither.Success<"saved"> | DEither.Left<"missing", string>;

const direct = DEither.whenIsRightOtherwise(
	input,
	(value) => `right:${value}` as const,
	(value) => `left:${DEither.unwrapLeft(value)}` as const,
);
type _CheckDirect = DCommon.ExpectType<typeof direct, "right:saved" | "left:missing", "one-extends-two">;

// Appel curifié : les deux branches sont configurées avant l’entrée du pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenIsRightOtherwise(
		(value) => `right:${value}` as const,
		(value) => `left:${DEither.unwrapLeft(value)}` as const,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "right:saved" | "left:missing", "one-extends-two">;
