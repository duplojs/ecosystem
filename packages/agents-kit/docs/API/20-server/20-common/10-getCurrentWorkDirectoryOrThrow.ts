/**
 * @title DSCommon.getCurrentWorkDirectoryOrThrow
 *
 * Obtenir le répertoire de travail courant ou lever une erreur.
 */
import * as DSCommon from "@duplojs/server/common";

const directory = DSCommon.getCurrentWorkDirectoryOrThrow();

// Le chemin absolu dépend du dossier courant du processus.
