import { AnyPath } from './types';
import { Absolute, Path } from './constraints';
export declare function getParentFolderPath<GenericPath extends AnyPath>(path: GenericPath): ((string & Path & (GenericPath extends Absolute ? Absolute : unknown)) | null);
