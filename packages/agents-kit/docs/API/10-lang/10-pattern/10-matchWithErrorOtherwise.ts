/**
 * @title DPattern.matchWithErrorOtherwise
 *
 * Traiter certains identifiants d’erreur et transmettre au fallback l’union d’erreurs non couverte.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

class ValidationError extends DCommon.DuploJSError.parentClass("validation") {}
class StorageError extends DCommon.DuploJSError.parentClass("storage") {}
class NetworkError extends DCommon.DuploJSError.parentClass("network") {}
declare const error: ValidationError | StorageError | NetworkError;

const message = DPattern.matchWithErrorOtherwise(
	error,
	{
		validation: (value) => value.message,
	},
	(value) => {
		const remaining: StorageError | NetworkError = value;
		return remaining.message;
	},
);
// Validation utilise son handler ; StorageError et NetworkError passent au fallback.
type _CheckMessage = DCommon.ExpectType<typeof message, string, "strict">;
