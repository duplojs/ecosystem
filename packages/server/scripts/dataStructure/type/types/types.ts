import type { FileType } from "../file";
import type { FolderType } from "../folder";

declare module "@duplojs/lang/dataStructure" {
	interface TypesStore {
		serverFile: FileType;
		serverFolder: FolderType;
	}
}
