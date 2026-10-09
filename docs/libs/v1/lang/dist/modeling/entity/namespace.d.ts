import { ForbiddenTopLevelNewType, NewTypeStructure } from '../newType';
import { ForbiddenMissingNewTypeInEntityShape } from './helper';
import { EntityStructure } from './base';
import type * as DCommon from '../../common';
import type * as DDataStructure from '../../dataStructure';
import type * as DKind from '../../kind';
export declare const namespaceKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/namespace", unknown>>;
export interface EntityNamespace<GenericEntityName extends Capitalize<string> = Capitalize<string>> extends DKind.Kind<typeof namespaceKind> {
    readonly name: GenericEntityName;
    createNewType<GenericName extends Capitalize<string>, GenericStructure extends DDataStructure.Structure, const GenericNewTypeConstraint extends readonly DDataStructure.Constraint<DDataStructure.StructureValue<GenericStructure>>[] = readonly []>(name: (GenericName & DCommon.NeverCoalescing<ForbiddenTopLevelNewType<DDataStructure.StructureValue<GenericStructure>>, unknown>), structure: GenericStructure, newTypeConstraints?: GenericNewTypeConstraint): NewTypeStructure<`${GenericEntityName}${GenericName}`, DDataStructure.StructureValue<GenericStructure>, GenericNewTypeConstraint>;
    createEntity<GenericShape extends DDataStructure.ShapeObjectStructure>(shape: () => (GenericShape & DCommon.NeverCoalescing<ForbiddenMissingNewTypeInEntityShape<DDataStructure.ShapeObjectStructureValue<GenericShape>>, unknown>)): EntityStructure<GenericEntityName, DDataStructure.ShapeObjectStructureValue<GenericShape>>;
}
export declare function createEntityNamespace<GenericName extends Capitalize<string>>(entityName: GenericName): EntityNamespace<GenericName>;
