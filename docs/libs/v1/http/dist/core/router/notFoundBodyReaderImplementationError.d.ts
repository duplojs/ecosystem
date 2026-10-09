import { BodyController } from '../request';
import { Route } from '../route';
import * as DKind from "@duplojs-v1/lang/kind";
declare const NotFoundBodyReaderImplementationError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/not-found-body-reader-implementation-error", unknown>>, ErrorConstructor>;
export declare class NotFoundBodyReaderImplementationError extends NotFoundBodyReaderImplementationError_base {
    route: Route;
    bodyController: BodyController;
    constructor(route: Route, bodyController: BodyController);
}
export {};
