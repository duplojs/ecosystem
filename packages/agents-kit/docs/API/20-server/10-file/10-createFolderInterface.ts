/**
 * @title DSFile.createFolderInterface
 *
 * Construire une référence de dossier sans accès au disque.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";

declare const path: string & DPath.Path;

const entry = DSFile.createFolderInterface(path);

// La construction ne vérifie ni l’existence ni la nature de la ressource.

// Ces méthodes consultent le système de fichiers et retournent un Either.
const children = await entry.getChildren();
const traversal = await entry.walk({ recursive: true });

// Un déplacement ou renommage réussi retourne une nouvelle interface ;
// la référence initiale conserve son ancien chemin.
