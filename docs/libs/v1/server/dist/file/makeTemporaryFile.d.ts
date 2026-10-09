import { FileSystemEither } from './types';
import * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export type MakeTemporaryFileResult = FileSystemEither<DEither.Right<"make-temporary-file", string> | DEither.Left<"make-temporary-file-permission-denied", unknown> | DEither.Left<"make-temporary-file-already-exists", unknown> | DEither.Left<"make-temporary-file-not-directory", unknown> | DEither.Left<"make-temporary-file-no-space", unknown> | DEither.Left<"make-temporary-file-read-only", unknown> | DEither.Left<"make-temporary-file-invalid-argument", unknown> | DEither.Left<"make-temporary-file-too-many-open-files", unknown> | DEither.Left<"make-temporary-file-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        makeTemporaryFile(prefix: string & DPath.Segment, suffix?: string & DPath.Segment): Promise<MakeTemporaryFileResult>;
    }
}
export declare const makeTemporaryFile: (prefix: string & DPath.Segment, suffix?: string & DPath.Segment) => Promise<MakeTemporaryFileResult>;
