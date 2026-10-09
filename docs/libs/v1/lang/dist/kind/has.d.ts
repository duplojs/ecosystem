import { Kind, Handler } from './base';
import type * as DCommon from '../common';
export declare function has<GenericInput extends unknown, const GenericKindHandlers extends DCommon.AnyTuple<Handler>, GenericKindHandler extends GenericKindHandlers[number]>(kinds: GenericKindHandlers): (input: GenericInput) => input is Extract<GenericInput, DCommon.UnionToIntersection<GenericKindHandler extends any ? Kind<GenericKindHandler> : never>>;
export declare function has<GenericInput extends unknown, const GenericKindHandlers extends DCommon.AnyTuple<Handler>, GenericKindHandler extends GenericKindHandlers[number]>(input: GenericInput, kinds: GenericKindHandlers): input is Extract<GenericInput, DCommon.UnionToIntersection<GenericKindHandler extends any ? Kind<GenericKindHandler> : never>>;
