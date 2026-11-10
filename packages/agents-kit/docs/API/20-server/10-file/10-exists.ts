/**
 * @title DSFile.exists
 *
 * Vérifier l’accès à une entrée du système de fichiers.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.exists(path);

// Le résultat est un Either : un échec ne signifie pas nécessairement que l’entrée est absente.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-exists-not-found": () => "missing",
			"file-system-exists-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-exists-not-found
// file-system-exists-permission-denied
// file-system-exists-not-directory
// file-system-exists-too-many-open-files
// file-system-exists-error
