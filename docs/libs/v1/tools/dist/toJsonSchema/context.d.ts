import { JsonSchema } from './result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface MapContextValue {
    readonly name: string;
    readonly schema: JsonSchema;
    readonly isOptional: boolean;
}
export type MapContext = Map<DDataStructure.Structure, MapContextValue>;
