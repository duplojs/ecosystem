import { FileExistConstraint } from '../fileExist';
import { FolderExistConstraint } from '../folderExist';
import { MimeTypeConstraint } from '../mimeType';
import { SizeConstraint } from '../size';
declare module "@duplojs-v1/lang/dataStructure" {
    interface ConstraintsStore {
        fileExist: FileExistConstraint;
        folderExist: FolderExistConstraint;
        size: SizeConstraint;
        mimeType: MimeTypeConstraint;
    }
}
