import { UnknownEntryInterface, FileInterface, FolderInterface } from './file';
declare module "@duplojs/lang/common" {
    interface ReplaceTraversalExclusions {
        fileInterface: FileInterface;
        folderInterface: FolderInterface;
        unknownEntryInterface: UnknownEntryInterface;
    }
}
