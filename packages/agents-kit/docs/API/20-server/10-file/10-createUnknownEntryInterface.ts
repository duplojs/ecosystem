/**
 * @title DSFile.createUnknownEntryInterface
 *
 * Construire une référence d’entrée de type inconnu sans accès au disque.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";

declare const path: string & DPath.Path;

const entry = DSFile.createUnknownEntryInterface(path);

// La construction ne vérifie ni l’existence ni la nature de la ressource.
