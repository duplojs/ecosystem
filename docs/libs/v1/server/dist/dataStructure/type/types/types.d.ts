import { FileType } from '../file';
import { FolderType } from '../folder';
declare module "@duplojs-v1/lang/dataStructure" {
    interface TypesStore {
        serverFile: FileType;
        serverFolder: FolderType;
    }
}
