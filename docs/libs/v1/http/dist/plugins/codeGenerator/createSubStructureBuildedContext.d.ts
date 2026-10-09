import { DataStructureToDataStructure } from '@duplojs-v1/tools';
export interface SubBuildedContext extends DataStructureToDataStructure.BuildedContext {
    identifier: string;
}
export declare function createSubStructureBuildedContext(buildedContext: DataStructureToDataStructure.BuildedContext): Generator<SubBuildedContext, unknown, unknown>;
