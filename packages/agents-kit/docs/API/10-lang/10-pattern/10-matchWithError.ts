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

// Appel direct : chaque nom de l’union exige une branche, sans clé étrangère.
const result = DPattern.matchWithError(error, {
	validation: (value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, ValidationError, "strict">;
		return value.message;
	},
	storage: (value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, StorageError, "strict">;
		return value.message;
	},
});
// La sortie est le message de l’erreur sélectionnée.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

// Appel curifié : configurer les branches directement dans le pipe.
const piped = DCommon.pipe(
	error,
	DPattern.matchWithError({
		validation: (value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, ValidationError, "strict">;
			return value.message;
		},
		storage: (value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, StorageError, "strict">;
			return value.message;
		},
	}),
);
// Même sélection : le message de l’erreur sélectionnée.
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;

// Les clés sont les identifiants fixés par parentClass, pas le nom de classe
// ni le message. Un Error natif ne porte pas ce contrat de discrimination.
