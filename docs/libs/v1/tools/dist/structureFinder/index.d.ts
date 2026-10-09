import { createResearcher } from './researcher';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export * from './researcher';
export interface StructureFinderParams {
    readonly researchers: readonly ReturnType<typeof createResearcher>[];
    readonly ignore?: Set<DDataStructure.Structure>;
    readonly continueAfterMatch?: boolean;
}
export declare function structureFinder<GenericPredicate extends DDataStructure.Structure>(structure: DDataStructure.Structure, predicate: (structure: DDataStructure.Structure) => structure is GenericPredicate, params: StructureFinderParams): readonly GenericPredicate[];
export declare function structureFinder(structure: DDataStructure.Structure, predicate: (structure: DDataStructure.Structure) => boolean, params: StructureFinderParams): readonly DDataStructure.Structure[];
