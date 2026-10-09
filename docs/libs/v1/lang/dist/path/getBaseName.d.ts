import { Absolute, Path, Segment } from './constraints';
export interface GetBaseNameParams {
    removeExtension?: boolean;
}
export declare function getBaseName<GenericPath extends string & (Path | Absolute | Segment)>(path: GenericPath, params?: GetBaseNameParams): (string & Segment) | null;
