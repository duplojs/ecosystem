import { DataStructureToDataStructure } from '@duplojs/tools';
export interface SubBuildedContext extends DataStructureToDataStructure.BuildedContext {
    identifier: string;
}
export declare function createSubStructureBuildedContext(buildedContext: DataStructureToDataStructure.BuildedContext): Generator<SubBuildedContext, unknown, unknown>;
