import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
export type MakeTemporaryDirectoryResult = FileSystemEither<DEither.Right<"make-temporary-directory", string> | DEither.Left<"make-temporary-directory-permission-denied", unknown> | DEither.Left<"make-temporary-directory-not-directory", unknown> | DEither.Left<"make-temporary-directory-no-space", unknown> | DEither.Left<"make-temporary-directory-read-only", unknown> | DEither.Left<"make-temporary-directory-invalid-argument", unknown> | DEither.Left<"make-temporary-directory-too-many-open-files", unknown> | DEither.Left<"make-temporary-directory-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        makeTemporaryDirectory(prefix: string): Promise<MakeTemporaryDirectoryResult>;
    }
}
export declare const makeTemporaryDirectory: (prefix: string) => Promise<MakeTemporaryDirectoryResult>;
