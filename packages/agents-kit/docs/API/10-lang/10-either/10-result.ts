/**
 * @title DEither.result
 *
 * Créer un état contextualisé de type Result, sans lui attribuer un succès ou un échec.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

// Appel classique : l’information et la valeur sont fournies ensemble.
const direct = DEither.result("validated", 42);
type _CheckDirect = DCommon.ExpectType<typeof direct, DEither.Result<"validated", 42>, "strict">;

// Appel curifié : l’information est configurée avant la valeur dans le pipe.
const piped = DCommon.pipe(
	42,
	DEither.result("validated"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DEither.Result<"validated", 42>, "strict">;
