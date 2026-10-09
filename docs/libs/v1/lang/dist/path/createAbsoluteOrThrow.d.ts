import { Absolute } from './constraints';
import * as DKind from '../kind';
declare const CreateAbsolutePathError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangPath/create-absolute-path-error", unknown>>, ErrorConstructor>;
export declare class CreateAbsolutePathError extends CreateAbsolutePathError_base {
    value: string;
    constructor(value: string);
}
export declare function createAbsoluteOrThrow(value: string): string & Absolute;
export {};
