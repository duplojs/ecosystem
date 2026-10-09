import { Request } from '..';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
import * as DKind from "@duplojs-v1/lang/kind";
export declare const bodyResultKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/body-result", unknown>>;
export interface BodyResult extends DKind.Kind<typeof bodyResultKind> {
    extract<GenericStructureParse extends (DDataStructure.Structure["parse"] | DDataStructure.Structure["asyncParse"])>(getValue: (input: unknown) => unknown, structureParse: GenericStructureParse): Promise<Awaited<ReturnType<GenericStructureParse>> | DEither.Left<"reader-error", Error>>;
}
export declare const bodyReaderKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/body-reader", string>>;
export interface BodyReader<GenericName extends string = string> extends DKind.Kind<typeof bodyReaderKind, GenericName> {
    getResult(request: Request): BodyResult;
}
export declare const bodyReaderImplementationKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/body-reader-implementation", string>>;
export interface BodyControllerParams {
    bodyMaxSize?: number;
}
export interface BodyReaderImplementation<GenericName extends string = string, GenericParams extends BodyControllerParams = BodyControllerParams> extends DKind.Kind<typeof bodyReaderImplementationKind, GenericName> {
    readonly codecs?: DDataStructure.Codecs;
    read(request: Request, params: GenericParams): Promise<DEither.Success | DEither.Left<"reader-error", Error>>;
}
export declare const bodyControllerKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/body-controller", string>>;
export interface BodyController<GenericName extends string = string, GenericParams extends BodyControllerParams = BodyControllerParams> extends DKind.Kind<typeof bodyControllerKind, GenericName> {
    readonly name: GenericName;
    readonly params: GenericParams;
    tryToCreateReader(readerImplementation: BodyReaderImplementation): DEither.Success<BodyReader<GenericName>> | DEither.Fail;
    createReaderOrThrow(readerImplementation: BodyReaderImplementation): BodyReader<GenericName>;
}
export declare const bodyControllerHandlerKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/body-controller-handler", unknown>>;
export interface BodyControllerHandler<GenericName extends string = string, GenericParams extends BodyControllerParams = BodyControllerParams> extends DKind.Kind<typeof bodyControllerHandlerKind> {
    readonly name: GenericName;
    create(params: GenericParams): BodyController<GenericName, GenericParams>;
    createReaderImplementation(read: BodyReaderImplementation<GenericName, GenericParams>["read"], codecs?: DDataStructure.Codecs): BodyReaderImplementation<GenericName, GenericParams>;
    is(input: unknown): input is BodyController<GenericName, GenericParams>;
}
declare const WrongBodyReaderImplementationError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/wrong-body-reader-implementation", unknown>>, ErrorConstructor>;
export declare class WrongBodyReaderImplementationError extends WrongBodyReaderImplementationError_base {
    controllerName: string;
    bodyReaderImplementation: BodyReaderImplementation;
    constructor(controllerName: string, bodyReaderImplementation: BodyReaderImplementation);
}
export declare function createBodyController<GenericName extends string, GenericParams extends BodyControllerParams>(name: GenericName): BodyControllerHandler<GenericName, GenericParams>;
export {};
