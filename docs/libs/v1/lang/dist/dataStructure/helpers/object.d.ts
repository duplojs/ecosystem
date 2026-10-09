import { Constraint } from '../constraint';
import { ObjectStructure, ShapeObjectStructureValue, ShapeObjectStructure } from '../structure';
export declare function object<GenericShape extends ShapeObjectStructure, const GenericConstraints extends readonly Constraint<ShapeObjectStructureValue<GenericShape>>[] = readonly []>(shape: GenericShape, constraints?: GenericConstraints): NoInfer<ObjectStructure<ShapeObjectStructureValue<GenericShape>, readonly [...GenericConstraints]>>;
