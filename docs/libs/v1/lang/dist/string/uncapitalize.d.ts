import { ReapplyCompatiblesConstraints } from './constraints';
import type * as DCommon from '../common';
type UncapitalizeOutput<GenericString extends string> = ReapplyCompatiblesConstraints<GenericString, Uncapitalize<Extract<DCommon.RemoveConstraint<GenericString>, string>>, "minCharacters">;
export declare function uncapitalize<GenericString extends string>(string: GenericString): UncapitalizeOutput<GenericString>;
export {};
