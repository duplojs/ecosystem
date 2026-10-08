import { type FileExistConstraint } from "../fileExist";
import { type MimeTypeConstraint } from "../mimeType";
import { type SizeConstraint } from "../size";

declare module "@duplojs/lang/dataStructure" {
	interface ConstraintsStore {
		fileExist: FileExistConstraint;
		size: SizeConstraint;
		mimeType: MimeTypeConstraint;
	}
}
