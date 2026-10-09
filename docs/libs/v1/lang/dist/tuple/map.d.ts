import { Map } from './types';
import type * as DCommon from '../common';
export interface MapTheFunctionParams<GenericTuple extends DCommon.AnyTuple> {
    index: number;
    self: GenericTuple;
}
export declare function map<const GenericTuple extends DCommon.AnyTuple, GenericOutput extends unknown>(theFunction: (element: GenericTuple[number], params: MapTheFunctionParams<GenericTuple>) => GenericOutput): (tuple: GenericTuple) => Map<GenericTuple, GenericOutput>;
export declare function map<const GenericTuple extends DCommon.AnyTuple, GenericOutput extends unknown>(tuple: GenericTuple, theFunction: (element: GenericTuple[number], params: MapTheFunctionParams<GenericTuple>) => GenericOutput): Map<GenericTuple, GenericOutput>;
