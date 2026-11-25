import { Absolute, Path } from './constraints';
import { AnyPath, RequireSegments } from './types';
import type * as DCommon from '../common';
type HasAbsolutePath<GenericSegments extends readonly AnyPath[]> = DCommon.ContainExtends<{
    [Prop in keyof GenericSegments]: [DCommon.IsExtends<GenericSegments[Prop], Absolute>];
}[Extract<keyof GenericSegments, number>], [
    true
]>;
export declare function resolveRelative<const GenericSegments extends readonly AnyPath[]>(segments: GenericSegments & RequireSegments<GenericSegments>): string & Path & (DCommon.BreakGenericLink<HasAbsolutePath<GenericSegments> extends true ? Absolute : unknown>);
export {};
