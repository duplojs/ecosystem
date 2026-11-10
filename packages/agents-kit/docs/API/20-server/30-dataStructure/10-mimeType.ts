/**
 * @title DSDataStructure.mimeType
 *
 * Contraindre le type MIME déduit de l’extension du fichier.
 */
import * as DSDataStructure from "@duplojs/server/dataStructure";

declare const input: unknown;

const structure = DSDataStructure.file([DSDataStructure.mimeType("image/png")]);
const result = await structure.asyncDecode(DSDataStructure.codecsString, input);

// Le type MIME est déduit de l’extension, pas du contenu.
// Le résultat distingue le décodage réussi de l’échec de validation.
