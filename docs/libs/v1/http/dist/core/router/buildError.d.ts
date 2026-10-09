import { Route } from '../route';
import { Steps } from '../steps';
import * as DKind from "@duplojs-v1/lang/kind";
declare const RouterBuildError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/router-build-error", unknown>>, ErrorConstructor>;
export declare class RouterBuildError extends RouterBuildError_base {
    route: Route;
    element: Route | Steps;
    constructor(route: Route, element: Route | Steps);
}
export {};
