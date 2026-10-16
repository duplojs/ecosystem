/**
 * @title DEither.whenIsRight
 *
 * Transformer la valeur d’un Right et transmettre les autres résultats inchangés.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.success("saved");

// Appel classique : la callback ne reçoit que la valeur du Right.
const direct = DEither.whenIsRight(input, (value) => `status:${value}` as const);
type _CheckDirect = DCommon.ExpectType<typeof direct, "status:saved", "strict">;

// Appel curifié : la transformation est directement placée dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.whenIsRight((value) => `status:${value}` as const),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, "status:saved", "strict">;
