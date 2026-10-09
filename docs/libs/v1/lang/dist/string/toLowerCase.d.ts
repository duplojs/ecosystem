import { ReapplyCompatiblesConstraints } from './constraints';
import type * as DCommon from '../common';
type ToLowerCaseOutput<GenericString extends string> = ReapplyCompatiblesConstraints<GenericString, Lowercase<Extract<DCommon.RemoveConstraint<GenericString>, string>>, "minCharacters">;
export declare function toLowerCase<GenericString extends string>(string: GenericString): ToLowerCaseOutput<GenericString>;
export {};
