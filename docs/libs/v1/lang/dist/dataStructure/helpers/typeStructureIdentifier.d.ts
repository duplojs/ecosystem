import { TypeStructure, Structure } from '../structure';
import { TypeValue, typeIdentifier, Types } from '../type';
import type * as DKind from '../../kind';
import type * as DArray from '../../array';
export declare function typeStructureIdentifier<GenericTypeKindHandler extends DArray.Unwrap<Parameters<typeof typeIdentifier>[1]>>(typeKind: GenericTypeKindHandler | GenericTypeKindHandler[]): (structure: Structure) => structure is TypeStructure<TypeValue<Extract<Types, DKind.Kind<GenericTypeKindHandler>>>>;
export declare function typeStructureIdentifier<GenericTypeKindHandler extends DArray.Unwrap<Parameters<typeof typeIdentifier>[1]>>(structure: Structure, typeKind: GenericTypeKindHandler | GenericTypeKindHandler[]): structure is TypeStructure<TypeValue<Extract<Types, DKind.Kind<GenericTypeKindHandler>>>>;
