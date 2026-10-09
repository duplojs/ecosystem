import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export declare function createEntryInterface(path: string & DPath.Path): Promise<DEither.Right<"file-interface", import('./fileInterface').FileInterface> | DEither.Right<"folder-interface", import('./folderInterface').FolderInterface> | DEither.Right<"unknown-entry-interface", import('./unknownEntryInterface').UnknownEntryInterface> | DEither.Left<"create-entry-interface-error", unknown>>;
