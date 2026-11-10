/**
 * @title DSDataStructure.folder
 *
 * Décrire une interface de dossier serveur.
 */
import * as DSDataStructure from "@duplojs/server/dataStructure";

declare const input: unknown;

const structure = DSDataStructure.folder([DSDataStructure.folderExist()]);
const result = await structure.asyncDecode(DSDataStructure.codecsString, input);

// Le codec construit une interface ; la contrainte inspecte le disque.
// Le résultat distingue le décodage réussi de l’échec de validation.
