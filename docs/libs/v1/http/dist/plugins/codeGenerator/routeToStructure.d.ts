import { Route } from '../../core/route';
import { ResponseContract } from '../../core/response';
import { DataStructureToTypescript } from '@duplojs-v1/tools';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface RouteToStructureParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare const bodyAsFormData: DataStructureToTypescript.StructureTransformer;
export declare function convertRoutePath(path: string): DDataStructure.TypeStructure<string, readonly []>;
export declare function routeToStructure(route: Route, params: RouteToStructureParams): readonly DDataStructure.Structure[];
