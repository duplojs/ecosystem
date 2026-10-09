import { ImportKind, MapImportContext } from './types';
export type AddImport = (path: string, typeName: string, type?: ImportKind) => void;
export declare function addImportToContext(importContext: MapImportContext, path: string, typeName: string, type: ImportKind): void;
export declare function createAddImport(importContext: MapImportContext): AddImport;
