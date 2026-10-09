import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const uuidConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/uuid-constraint", unknown>>;
export interface UuidConstraintDefinition extends ConstraintDefinition {
}
export interface UuidConstraint extends DCommon.Forward<Constraint<string, string & DString.Uuid, UuidConstraintDefinition> & DKind.Kind<typeof uuidConstraintKind>> {
}
export declare const UuidConstraint: () => UuidConstraint;
