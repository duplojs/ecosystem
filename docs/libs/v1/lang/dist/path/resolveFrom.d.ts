import { Absolute, Path } from './constraints';
import { AnyPath, RequireSegments } from './types';
import type * as DCommon from '../common';
export interface ResolveFromParams {
    stayInOrigin?: boolean;
}
export declare function resolveFrom<const GenericSegments extends readonly AnyPath[], const GenericParams extends ResolveFromParams = never>(origin: string & Absolute, segments: GenericSegments & RequireSegments<GenericSegments>, params?: GenericParams): (string & Path & Absolute) | (DCommon.BreakGenericLink<GenericParams extends {
    stayInOrigin?: false | undefined;
} ? never : null>);
