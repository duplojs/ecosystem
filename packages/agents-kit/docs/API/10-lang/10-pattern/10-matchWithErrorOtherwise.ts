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

// Appel direct : traiter certains noms ; le repli reçoit uniquement le reste.
const result = DPattern.matchWithErrorOtherwise(
	error,
	{
		validation: (value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, ValidationError, "strict">;
			return value.message;
		},
	},
	(value) => {
		type _CheckRemaining = DCommon.ExpectType<typeof value, StorageError | NetworkError, "strict">;
		return value.message;
	},
);
// validation produit son résultat ; les autres variantes fournissent leur message.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

// Appel curifié dans un pipe : le repli conserve le même affinement.
const piped = DCommon.pipe(
	error,
	DPattern.matchWithErrorOtherwise(
		{
			validation: (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, ValidationError, "strict">;
				return value.message;
			},
		},
		(value) => {
			type _CheckRemaining = DCommon.ExpectType<typeof value, StorageError | NetworkError, "strict">;
			return value.message;
		},
	),
);
// validation produit son résultat ; les autres variantes fournissent leur message.
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
