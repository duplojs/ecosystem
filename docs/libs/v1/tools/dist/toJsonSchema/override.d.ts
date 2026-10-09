import { StructureTransformerBuildFunction } from './structureTransformer';
import { JsonSchema } from './result';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type JsonSchemaTransformerOverride<GenericStructure extends DDataStructure.Structure = DDataStructure.Structure> = JsonSchema | StructureTransformerBuildFunction<GenericStructure>;
declare module "@duplojs-v1/lang/dataStructure" {
    interface StructureDefinition {
        identifier?: string;
        overrideJsonSchemaTransformer?: StructureTransformerBuildFunction;
    }
    interface Structure {
        /**
         * @deprecated this method mutated the DataStructure by adding an identifier
         */
        setIdentifier(identifier: string): this;
        addIdentifier(identifier: string): this;
        /**
         * @deprecated this method mutated the DataStructure by adding an override transformer
         */
        setOverrideJsonSchemaTransformer(overrideTransformer: JsonSchemaTransformerOverride<this> | null): this;
        addOverrideJsonSchemaTransformer(overrideTransformer: JsonSchemaTransformerOverride<this> | null): this;
    }
}
