/**
 * @title DSCommon.setCurrentWorkingDirectoryOrThrow
 *
 * Changer le répertoire de travail ou lever une erreur.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";

declare const directory: string & DPath.Absolute;

// Lève SetCurrentWorkingDirectoryError si le changement échoue.
DSCommon.setCurrentWorkingDirectoryOrThrow(directory);
