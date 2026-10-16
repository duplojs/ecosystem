/**
 * @title DEither.whenHasInformationOtherwise
 *
 * Traiter les variantes ciblées par information et fournir une branche de repli.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.left("invalid", "bad-input") as DEither.Left<"invalid", string> | DEither.Success<"saved">;

// Appel classique : la branche otherwise reçoit le résultat non ciblé.
const direct = DEither.whenHasInformationOtherwise(
	input,
	"invalid",
	(value) => `invalid:${value}` as const,
	(value) => DEither.unwrapRight(value),
);
type _CheckDirect = DCommon.ExpectType<typeof direct, "invalid:bad-input" | "saved", "one-extends-two">;

// Appel curifié : les deux traitements sont configurés dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenHasInformationOtherwise(
		"invalid",
		(value) => `invalid:${value}` as const,
		(value) => DEither.unwrapRight(value),
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "invalid:bad-input" | "saved", "one-extends-two">;
