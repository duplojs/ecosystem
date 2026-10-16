/**
 * @title DEither.rewriteInformation
 *
 * Renommer certaines informations en conservant le statut et la valeur.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const input = DEither.success("saved");

// Appel classique : seule l’information `success` est renommée.
const direct = DEither.rewriteInformation(input, { success: "stored" });
type _CheckDirect = DCommon.ExpectType<typeof direct, DEither.Right<"stored", "saved">, "strict">;

// Appel curifié : le mapping est configuré dans le pipe.
const piped = DCommon.pipe(
	input,
	DEither.rewriteInformation({ success: "stored" }),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DEither.Right<"stored", "saved">, "strict">;

const unchanged = DEither.rewriteInformation(DEither.left("missing", "not-found"), { missing: "not-found" });
// Le statut et la valeur sont conservés tandis que l’information est renommée.
type _CheckUnchanged = DCommon.ExpectType<typeof unchanged, DEither.Left<"not-found", "not-found">, "strict">;
