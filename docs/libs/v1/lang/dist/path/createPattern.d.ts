import { Path } from './constraints';
export type PathMatcher = (path: string & Path) => boolean;
export declare function createPattern(patterns: string | readonly string[]): PathMatcher;
