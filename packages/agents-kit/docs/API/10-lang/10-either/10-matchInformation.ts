/**
 * @title DEither.matchInformation
 *
 * Appliquer exhaustivement une callback selon l’information du résultat.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;
declare const stored: "stored";
declare const rejected: "rejected";

// Appel classique : chaque information de l’union possède une callback.
const direct = DEither.matchInformation(input, {
	success: (value) => stored,
	missing: (value) => rejected,
});
type _CheckDirect = DCommon.ExpectType<typeof direct, "stored" | "rejected", "strict">;

// Appel curifié : le matcher est directement placé dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.matchInformation({
		success: (value) => stored,
		missing: (value) => rejected,
	}),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "stored" | "rejected", "strict">;
