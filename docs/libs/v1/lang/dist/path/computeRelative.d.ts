import { Absolute, Path } from './constraints';
export declare function computeRelative<GenericSourcePath extends string & Absolute, GenericDestinationPath extends string & Absolute>(source: GenericSourcePath, destination: GenericDestinationPath): string & Path;
