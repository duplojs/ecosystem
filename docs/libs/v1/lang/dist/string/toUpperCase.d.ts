import { ReapplyCompatiblesConstraints } from './constraints';
import type * as DCommon from '../common';
type ToUpperCaseOutput<GenericString extends string> = ReapplyCompatiblesConstraints<GenericString, Uppercase<Extract<DCommon.RemoveConstraint<GenericString>, string>>, "minCharacters">;
export declare function toUpperCase<GenericString extends string>(string: GenericString): ToUpperCaseOutput<GenericString>;
export {};
