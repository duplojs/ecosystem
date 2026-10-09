import { Absolute, Path, Segment } from './constraints';
import { RequireSegments } from './types';
import type * as DCommon from '../common';
export interface ResolveFromParams {
    stayInOrigin?: boolean;
}
export declare function resolveFrom<const GenericSegments extends readonly (string & (Path | Absolute | Segment))[], const GenericParams extends ResolveFromParams>(origin: string & Absolute, segments: GenericSegments & RequireSegments<GenericSegments>, params?: GenericParams): (string & Absolute) | (DCommon.BreakGenericLink<DCommon.Or<[
    DCommon.IsEqual<GenericParams["stayInOrigin"], ResolveFromParams["stayInOrigin"]>,
    DCommon.IsEqual<GenericParams["stayInOrigin"], false>,
    DCommon.IsEqual<GenericParams["stayInOrigin"], unknown>
]> extends true ? never : null>);
