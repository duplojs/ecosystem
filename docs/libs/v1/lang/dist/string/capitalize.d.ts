import { ReapplyCompatiblesConstraints } from './constraints';
import type * as DCommon from '../common';
type CapitalizeOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, Capitalize<Extract<DCommon.RemoveConstraint<GenericString>, string>>, "minCharacters" | "lengthEqual"> : never;
export declare function capitalize<GenericString extends string>(string: GenericString): CapitalizeOutput<GenericString>;
export {};
