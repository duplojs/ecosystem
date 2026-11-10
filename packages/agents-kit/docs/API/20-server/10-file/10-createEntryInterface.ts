/**
 * @title DSFile.createEntryInterface
 *
 * Inspecter une entrée et construire son interface adaptée.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";

declare const path: string & DPath.Path;

const result = await DSFile.createEntryInterface(path);

// La réussite distingue fichier, dossier et entrée inconnue ; un échec porte l’erreur d’inspection.
