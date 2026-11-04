/**
 * @title DEither.matchInformationOtherwise
 *
 * Appliquer une callback pour certaines informations et une branche de repli pour les autres.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;
declare const stored: "stored";
declare const unhandled: "unhandled";

// Appel classique : seules les informations documentées dans le matcher sont ciblées.
const direct = DEither.matchInformationOtherwise(
	input,
	{ success: (value: "saved") => stored },
	(value) => unhandled,
);
type _CheckDirect = DCommon.ExpectType<typeof direct, "stored" | "unhandled", "strict">;

// Appel curifié : le matcher et la branche de repli sont configurés dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.matchInformationOtherwise(
		{ success: (value: "saved") => stored },
		(value) => unhandled,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "stored" | "unhandled", "strict">;
