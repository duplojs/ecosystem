import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface ResearcherParams {
    find(structure: DDataStructure.Structure): void;
}
export declare function createResearcher<GenericPredicate extends DDataStructure.Structure>(predicate: (structure: DDataStructure.Structure) => structure is GenericPredicate, researcher: (structure: GenericPredicate, params: ResearcherParams) => void): (structure: DDataStructure.Structure, params: ResearcherParams) => void;
export declare function createResearcher(predicate: (structure: DDataStructure.Structure) => boolean, researcher: (structure: DDataStructure.Structure, params: ResearcherParams) => void): (structure: DDataStructure.Structure, params: ResearcherParams) => void;
