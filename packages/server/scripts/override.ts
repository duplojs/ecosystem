import "@duplojs/lang/common";
import { type UnknownEntryInterface, type FileInterface, type FolderInterface } from "./file";

declare module "@duplojs/lang/common" {
	interface ReplaceTraversalExclusions {
		fileInterface: FileInterface;
		folderInterface: FolderInterface;
		unknownEntryInterface: UnknownEntryInterface;
	}
}
