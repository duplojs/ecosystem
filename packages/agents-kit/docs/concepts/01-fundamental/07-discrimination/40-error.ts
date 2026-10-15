/**
 * @title Discrimination des erreurs par identifiant.
 *
 * Sélection exhaustive ou partielle des erreurs DuploJS, avec typage précis des branches et des cas restants.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";

// Le matcher sélectionne l'identifiant porté par le kind d'une DuploJSError.
// Cet identifiant est fixé ici par parentClass ; il ne dépend ni du message
// ni du nom de la classe.
class InvalidInputError extends DCommon.DuploJSError.parentClass("invalid-input") {}
class UnavailableServiceError extends DCommon.DuploJSError.parentClass("unavailable-service", Error) {}

type OperationError =
	| InvalidInputError
	| UnavailableServiceError;

declare const error: OperationError;

// matchWithError exige un handler pour chaque identifiant de l'union
// et refuse les clés étrangères à celle-ci. Ajouter une erreur au contrat
// impose donc de compléter le matcher.
// Chaque callback reçoit l'erreur précise, avec ses propriétés et sa cause typées.

// string | Error
const matchedError = DPattern.matchWithError(
	error,
	{
		// InvalidInputError ; cause est undefined.
		"invalid-input": (invalidInput) => invalidInput.message,

		// UnavailableServiceError ; cause est Error.
		"unavailable-service": (unavailableService) => unavailableService.cause,
	},
);

// matchWithErrorOtherwise sélectionne explicitement une partie des identifiants.
// Le callback otherwise reçoit uniquement les erreurs non prises en charge.
// Les deux fonctions existent en forme directe et curried, utilisable dans un pipe.

// string | Error
const matchedErrorOtherwise = DCommon.pipe(
	error,
	DPattern.matchWithErrorOtherwise(
		{
			// InvalidInputError
			"invalid-input": (invalidInput) => invalidInput.message,
		},
		// UnavailableServiceError
		(unavailableService) => unavailableService.cause,
	),
);

// Ces matchers attendent des DuploJSError dont les identifiants sont des types
// littéraux connus. Conserver l'union précise : Error natif et DuploJSError
// sans identifiant littéral ne fournissent pas ce contrat de discrimination.
