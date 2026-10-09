import { Absolute, Path, Segment } from './constraints';
import { RequireSegments } from './types';
import type * as DCommon from '../common';
type HasAbsolutePath<GenericSegments extends readonly (string & (Path | Absolute | Segment))[]> = DCommon.ContainExtends<{
    [Prop in keyof GenericSegments]: [DCommon.IsExtends<GenericSegments[Prop], Absolute>];
}[Extract<keyof GenericSegments, number>], [
    true
]>;
export declare function resolveRelative<const GenericSegments extends readonly (string & (Path | Absolute | Segment))[]>(segments: GenericSegments & RequireSegments<GenericSegments>): string & Path & (DCommon.BreakGenericLink<HasAbsolutePath<GenericSegments> extends true ? Absolute : unknown>);
export {};
