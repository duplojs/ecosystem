/**
 * @title DEither.keepAsRightByInformation
 *
 * Reclasser comme Right les variantes portant certaines informations.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.left("validated", "Alice");

// Appel classique : l’information ciblée devient un Right.
const direct = DEither.keepAsRightByInformation(input, "validated");
type _CheckDirect = DCommon.ExpectType<typeof direct, DEither.Right<"validated", "Alice">, "strict">;

// Appel curifié : le changement de statut est placé dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.keepAsRightByInformation("validated"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DEither.Right<"validated", "Alice">, "strict">;

// Un Right dont l’information n’est pas ciblée devient un Left ; les informations
// impossibles pour l’union d’entrée doivent être déclarées explicitement au runtime.
const rejected = DEither.keepAsRightByInformation(DEither.right("other", 42), "selected" as never);
type _CheckRejected = DCommon.ExpectType<
	typeof rejected,
	DEither.Left<"other", 42>,
	"strict"
>;
