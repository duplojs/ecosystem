import { HubPlugin } from '../../core/hub';
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPath from "@duplojs/lang/path";
export interface GenerateStructureParams {
    outputFolder: string & DPath.Path;
    disabledFromRoute?: boolean;
    structures?: DDataStructure.Structure[];
}
export interface CodeGeneratorPluginParams {
    outputFile: string & DPath.Path;
    generateStructure?: GenerateStructureParams;
}
export declare function codeGeneratorPlugin(pluginParams: CodeGeneratorPluginParams): () => HubPlugin;
