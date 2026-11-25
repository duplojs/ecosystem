import { AnyPath } from './types';
export type PathMatcher<GenericPath extends AnyPath = AnyPath> = (path: GenericPath) => boolean;
export declare function createMatcher(patterns: string | readonly string[]): PathMatcher;
