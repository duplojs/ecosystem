import * as DKind from "@duplojs-v1/lang/kind";
declare const BodyParseFormDataError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpInterfacesNode/body-parse-form-data-error", unknown>>, ErrorConstructor>;
export declare class BodyParseFormDataError extends BodyParseFormDataError_base {
    information: string;
    constructor(information: string);
}
export {};
