import { typeKind, Type } from '../base';
import type * as DKind from '../../../kind';
export type TypeValue<GenericType extends Type> = DKind.GetValue<typeof typeKind, GenericType>;
