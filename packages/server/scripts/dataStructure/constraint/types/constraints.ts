import { type FileExistConstraint } from "../fileExist";
import { type FolderExistConstraint } from "../folderExist";
import { type MimeTypeConstraint } from "../mimeType";
import { type SizeConstraint } from "../size";

declare module "@duplojs/lang/dataStructure" {
	interface ConstraintsStore {
		fileExist: FileExistConstraint;
		folderExist: FolderExistConstraint;
		size: SizeConstraint;
		mimeType: MimeTypeConstraint;
	}
}
