/**
 * @title DSDataStructure.size
 *
 * Contraindre la taille en octets d’un fichier.
 */
import * as DEither from "@duplojs/lang/either";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import type * as DSFile from "@duplojs/server/file";

declare const file: DSFile.FileInterface;

const structure = DSDataStructure.file([
	DSDataStructure.fileExist(),
	DSDataStructure.size({
		min: 1,
		max: "1mb",
	}),
]);

// La taille est lue dans les métadonnées : asyncCheck est nécessaire même
// lorsque l'entrée est déjà une interface et ne nécessite pas de codec.
const result = await structure.asyncCheck(file);

if (DEither.isRight(result)) {
	const checkedFile = DEither.unwrapRight(result);

	// Les bornes sont vérifiées au moment du contrôle ; elles ne réservent pas
	// le fichier et ne valident pas le contenu de ses octets.
	const path = checkedFile.path;
} else {
	const validationError = DEither.unwrapLeft(result);
}
