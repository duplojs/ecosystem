/**
 * @title DSCommon.getCurrentDirectoryName
 *
 * Obtenir le dossier absolu du module fourni.
 */
import * as DSCommon from "@duplojs/server/common";

const moduleDirectory = DSCommon.getCurrentDirectoryName(import.meta);

// Ce chemin dépend du module, pas du répertoire de lancement.
