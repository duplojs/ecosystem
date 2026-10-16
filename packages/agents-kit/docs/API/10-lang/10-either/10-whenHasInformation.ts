/**
 * @title DEither.whenHasInformation
 *
 * Transformer la valeur des variantes portant une information donnée.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.left("invalid", "bad-input");

// Appel classique : la callback reçoit la valeur de l’information ciblée.
const direct = DEither.whenHasInformation(
	input,
	"invalid",
	(value) => `reason:${value}` as const,
);
type _CheckDirect = DCommon.ExpectType<typeof direct, "reason:bad-input", "strict">;

// Appel curifié : l’information et la callback sont configurées dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenHasInformation(
		"invalid",
		(value) => `reason:${value}` as const,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "reason:bad-input", "strict">;

const unchanged = DEither.whenHasInformation(
	DEither.success("saved") as DEither.Success<"saved"> | DEither.Left<"invalid", string>,
	["invalid"],
	(value) => value,
);
// Une information non ciblée transmet le Right inchangé.
type _CheckUnchanged = DCommon.ExpectType<typeof unchanged, string | DEither.Success<"saved">, "strict">;
