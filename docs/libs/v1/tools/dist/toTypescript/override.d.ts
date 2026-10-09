import { Typescript } from '../typescript';
import { AddImport, MapImportContextValue } from './importContext';
import { StructureTransformerBuildFunction } from './structureTransformer';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type MapImportContextEntry = readonly [
    path: string,
    value: MapImportContextValue
];
export type TypescriptTransformerOverride<GenericStructure extends DDataStructure.Structure = DDataStructure.Structure> = Typescript.TypeNode | StructureTransformerBuildFunction<GenericStructure>;
declare module "@duplojs-v1/lang/dataStructure" {
    interface StructureDefinition {
        identifier?: string;
        overrideTypescriptTransformer?: StructureTransformerBuildFunction;
        mapImportContextEntries?: readonly MapImportContextEntry[];
    }
    interface Structure {
        /**
         * @deprecated this method mutated the DataStructure by adding an identifier
         */
        setIdentifier(identifier: string): this;
        addIdentifier(identifier: string): this;
        /**
         * @deprecated this method mutated the DataStructure by adding an override transformer
         */
        setOverrideTypescriptTransformer(overrideTransformer: TypescriptTransformerOverride<this> | null): this;
        addOverrideTypescriptTransformer(overrideTransformer: TypescriptTransformerOverride<this> | null): this;
        /**
         * @deprecated this method mutated the DataStructure by adding an map import context
         */
        setMapImportContextEntries(...entries: readonly MapImportContextEntry[]): this;
        addMapImportContextEntries(...entries: readonly MapImportContextEntry[]): this;
    }
}
export declare function applyMapImportContextEntries(addImport: AddImport, entries: readonly MapImportContextEntry[]): void;
