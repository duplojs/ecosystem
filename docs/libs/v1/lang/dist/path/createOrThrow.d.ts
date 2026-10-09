import { Path } from './constraints';
import * as DCommon from '../common';
declare const CreatePathError_base: abstract new (error: string) => DCommon.DuploJSError<"path-create-path-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-path-create-path-error", unknown>>, unknown>;
export declare class CreatePathError extends CreatePathError_base {
    value: string;
    constructor(value: string);
}
export declare function createOrThrow(value: string): string & Path;
export {};
