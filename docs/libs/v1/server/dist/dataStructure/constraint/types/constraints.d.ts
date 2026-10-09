import { ExistConstraint } from '../exist';
import { MimeTypeConstraint } from '../mimeType';
import { SizeConstraint } from '../size';
declare module "@duplojs-v1/lang/dataStructure" {
    interface ConstraintsStore {
        exist: ExistConstraint;
        size: SizeConstraint;
        mimeType: MimeTypeConstraint;
    }
}
