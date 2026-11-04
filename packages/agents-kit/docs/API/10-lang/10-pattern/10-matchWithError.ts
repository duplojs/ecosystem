/**
 * @title DPattern.matchWithError
 *
 * Traiter chaque variante d’une union d’erreurs DuploJS selon son identifiant typé.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

class ValidationError extends DCommon.DuploJSError.parentClass("validation") {}
class StorageError extends DCommon.DuploJSError.parentClass("storage") {}
declare const error: ValidationError | StorageError;

const message = DPattern.matchWithError(error, {
	validation: (value) => {
		const exact: ValidationError = value;
		return exact.message;
	},
	storage: (value) => {
		const exact: StorageError = value;
		return exact.message;
	},
});
// Le handler correspondant retourne le message de l’erreur.
type _CheckMessage = DCommon.ExpectType<typeof message, string, "strict">;
