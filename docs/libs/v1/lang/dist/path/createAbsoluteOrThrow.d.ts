import { Absolute } from './constraints';
import * as DCommon from '../common';
declare const CreateAbsolutePathError_base: abstract new (error: string) => DCommon.DuploJSError<"path-create-absolute-path-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-path-create-absolute-path-error", unknown>>, unknown>;
export declare class CreateAbsolutePathError extends CreateAbsolutePathError_base {
    value: string;
    constructor(value: string);
}
export declare function createAbsoluteOrThrow(value: string): string & Absolute;
export {};
