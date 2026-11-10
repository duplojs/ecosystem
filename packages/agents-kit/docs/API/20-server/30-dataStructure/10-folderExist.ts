/**
 * @title DSDataStructure.folderExist
 *
 * Exiger que l’interface représente un dossier existant.
 */
import * as DSDataStructure from "@duplojs/server/dataStructure";

declare const input: unknown;

const structure = DSDataStructure.folder([DSDataStructure.folderExist()]);
const result = await structure.asyncDecode(DSDataStructure.codecsString, input);

// La vérification asynchrone constate l’état du disque au moment du décodage.
// Le résultat distingue le décodage réussi de l’échec de validation.
