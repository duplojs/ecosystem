import { Absolute, Path } from './constraints';
export declare function getParentFolderPath<GenericPath extends string & (Path | Absolute)>(path: GenericPath): (string & Path) | null;
