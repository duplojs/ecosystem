/**
 * @title DSFile.createFileInterface
 *
 * Construire une référence de fichier sans accès au disque.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";

declare const path: string & DPath.Path;

const entry = DSFile.createFileInterface(path);

// La construction ne vérifie ni l’existence ni la nature de la ressource.

// Les méthodes de référence extraient les composants sans accès au disque.
const name = entry.getName();
const mimeType = entry.getMimeType();

// stat, exists et les opérations de déplacement consultent le système.
// rename, move et relocate retournent une nouvelle interface en cas de succès ;
// ils ne modifient pas le chemin de cette référence.
const metadata = await entry.stat();
