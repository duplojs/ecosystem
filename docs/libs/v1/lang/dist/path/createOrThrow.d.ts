import { Path } from './constraints';
import * as DKind from '../kind';
declare const CreatePathError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangPath/create-path-error", unknown>>, ErrorConstructor>;
export declare class CreatePathError extends CreatePathError_base {
    value: string;
    constructor(value: string);
}
export declare function createOrThrow(value: string): string & Path;
export {};
