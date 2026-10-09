import { Typescript } from '../typescript';
import { StructureTransformerBuildFunction } from './structureTransformer';
import { ConstraintTransformerBuildFunction } from './constraintTransformer';
declare module "@duplojs-v1/lang/dataStructure" {
    interface StructureDefinition {
        overrideDataStructureTransformer?: StructureTransformerBuildFunction;
    }
    interface Structure {
        /**
         * @deprecated this method mutated the dataStructure by adding an override transformer
         */
        setOverrideDataStructureTransformer(transformer: (Typescript.CallExpression | Typescript.Identifier | StructureTransformerBuildFunction<this> | null)): this;
        addOverrideDataStructureTransformer(transformer: (Typescript.CallExpression | Typescript.Identifier | StructureTransformerBuildFunction<this> | null)): this;
    }
    interface ConstraintDefinition {
        overrideConstraintTransformer?: ConstraintTransformerBuildFunction;
    }
    interface Constraint {
        /**
         * @deprecated this method mutated the constraint by adding an override transformer
         */
        setOverrideConstraintTransformer(transformer: (Typescript.CallExpression | Typescript.Identifier | ConstraintTransformerBuildFunction<this> | null)): this;
        addOverrideConstraintTransformer(transformer: (Typescript.CallExpression | Typescript.Identifier | ConstraintTransformerBuildFunction<this> | null)): this;
    }
}
