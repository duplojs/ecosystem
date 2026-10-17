import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
export declare function createEntryInterface(path: string & DPath.Path): Promise<DEither.Right<"file-interface", import('./fileInterface').FileInterface<string & DPath.Path>> | DEither.Right<"folder-interface", import('./folderInterface').FolderInterface<string & DPath.Path>> | DEither.Right<"unknown-entry-interface", import('./unknownEntryInterface').UnknownEntryInterface<string & DPath.Path>> | DEither.Left<"create-entry-interface-error", import('./stat').StatErrors>>;
