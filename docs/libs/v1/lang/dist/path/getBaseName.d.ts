import { AnyPath } from './types';
import { Path, Segment } from './constraints';
export interface GetBaseNameParams {
    removeExtension?: boolean;
}
export declare function getBaseName<GenericPath extends AnyPath>(path: GenericPath, params?: GetBaseNameParams): (string & Segment & Path) | null;
