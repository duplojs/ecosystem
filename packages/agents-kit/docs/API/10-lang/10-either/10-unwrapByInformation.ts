/**
 * @title DEither.unwrapByInformation
 *
 * Extraire les variantes portant une information donnée et transmettre les autres.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;

// Appel classique : seule l’information ciblée est déballée.
const direct = DEither.unwrapByInformation(input, "success");
type _CheckDirect = DCommon.ExpectType<typeof direct, "saved" | DEither.Left<"missing", Error>, "strict">;

// Appel curifié : plusieurs informations peuvent être ciblées par un tableau.
const piped = DCommon.pipe(
	input,
	DEither.unwrapByInformation(["success", "missing"]),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "saved" | Error, "strict">;
