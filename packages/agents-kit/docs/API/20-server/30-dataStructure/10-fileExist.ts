/**
 * @title DSDataStructure.fileExist
 *
 * Exiger que l’interface représente un fichier existant.
 */
import * as DEither from "@duplojs/lang/either";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DSFile from "@duplojs/server/file";

declare const input: unknown;

const structure = DSDataStructure.file([DSDataStructure.fileExist()]);

// Le codec transforme le chemin textuel en FileInterface. La contrainte
// interroge ensuite le système de fichiers : utiliser asyncDecode.
const result = await structure.asyncDecode(DSDataStructure.codecsString, input);

if (DEither.isRight(result)) {
	const file = DEither.unwrapRight(result);

	// La validation a constaté l'existence au moment du contrôle ; le fichier
	// peut avoir changé ou disparu avant cette lecture, qui peut encore échouer.
	const readResult = await DSFile.readTextFile(file.path);
} else {
	// Le décodage du chemin ou le contrôle de la ressource a échoué.
	const validationError = DEither.unwrapLeft(result);
}
