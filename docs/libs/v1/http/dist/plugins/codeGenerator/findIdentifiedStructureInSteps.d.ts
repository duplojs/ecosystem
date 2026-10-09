import { Steps } from '../../core/steps';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type IdentifiedStructure = (DDataStructure.Structure & {
    definition: {
        identifier: string;
    };
});
export declare function structureHasIdentifier(structure: DDataStructure.Structure): structure is IdentifiedStructure;
export interface findIdentifiedStructureInStepsParams {
    readonly ignoreStructure: Set<DDataStructure.Structure>;
}
export declare function findIdentifiedStructureInSteps(steps: readonly Steps[], params: findIdentifiedStructureInStepsParams): readonly IdentifiedStructure[];
