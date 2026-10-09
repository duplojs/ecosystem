import { Absolute, Path, Segment } from './constraints';
export interface GetExtensionNameParams {
    withDot?: boolean;
}
export declare function getExtensionName<GenericPath extends string & (Path | Absolute | Segment)>(path: GenericPath, params?: GetExtensionNameParams): (string & Segment) | null;
