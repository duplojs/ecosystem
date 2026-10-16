/**
 * @title DEither.whenIsLeftOtherwise
 *
 * Traiter séparément les Left et les autres résultats.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.success("saved") as DEither.Success<"saved"> | DEither.Left<"invalid", string>;

// Appel classique : la seconde callback reçoit le résultat lorsqu’il n’est pas Left.
const direct = DEither.whenIsLeftOtherwise(
	input,
	(value) => `left:${value}` as const,
	(value) => DEither.unwrapRight(value),
);
type _CheckDirect = DCommon.ExpectType<typeof direct, "left:invalid" | "saved", "one-extends-two">;

// Appel curifié : les deux branches sont configurées avant l’entrée du pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenIsLeftOtherwise(
		(value) => `left:${value}` as const,
		(value) => DEither.unwrapRight(value),
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "left:invalid" | "saved", "one-extends-two">;
