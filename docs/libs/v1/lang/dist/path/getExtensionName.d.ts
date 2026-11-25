import { AnyPath } from './types';
import { Path, Segment } from './constraints';
export interface GetExtensionNameParams {
    withDot?: boolean;
}
export declare function getExtensionName<GenericPath extends AnyPath>(path: GenericPath, params?: GetExtensionNameParams): (string & Segment & Path) | null;
