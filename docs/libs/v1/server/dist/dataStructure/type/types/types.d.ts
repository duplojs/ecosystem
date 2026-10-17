import { FileType } from '../file';
import { FolderType } from '../folder';
declare module "@duplojs/lang/dataStructure" {
    interface TypesStore {
        serverFile: FileType;
        serverFolder: FolderType;
    }
}
