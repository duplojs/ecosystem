import { StatResult } from './stat';
import { ExistsResult } from './exists';
import type * as DKind from "@duplojs/lang/kind";
import * as DPath from "@duplojs/lang/path";
declare const unknownInterfaceKind: DKind.Handler<DKind.Definition<"@DuplojsServer/unknownInterface", unknown>>;
export type EntryPath = DPath.AnyPath;
export interface UnknownEntryInterface<GenericPath extends DPath.AnyPath = DPath.AnyPath> extends DKind.Kind<typeof unknownInterfaceKind> {
    path: GenericPath & DPath.Path;
    getName(): (string & DPath.Segment & DPath.Path) | null;
    getParentPath(): ReturnType<typeof DPath.getParentFolderPath<GenericPath>>;
    stat(): Promise<StatResult>;
    exist(): Promise<ExistsResult>;
}
export declare function createUnknownEntryInterface<GenericPath extends DPath.AnyPath = DPath.AnyPath>(path: GenericPath): UnknownEntryInterface<GenericPath>;
export declare function isUnknownEntryInterface<GenericInput extends unknown>(input: GenericInput): input is Extract<GenericInput, UnknownEntryInterface>;
export declare const isUnknownEntryInterfaceFromUnknown: (input: unknown) => input is UnknownEntryInterface;
export {};
