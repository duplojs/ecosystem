/**
 * @title DSCommon.setCurrentWorkingDirectory
 *
 * Changer le répertoire de travail et retourner un résultat.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";

declare const directory: string & DPath.Absolute;

const result = DSCommon.setCurrentWorkingDirectory(directory);

// Un Left indique que le changement a échoué ; les chemins relatifs suivants
// sont résolus depuis le nouveau dossier uniquement en cas de succès.
