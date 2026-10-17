import { StatResult } from './stat';
import { ExistsResult } from './exists';
import type * as DKind from "@duplojs/lang/kind";
import * as DPath from "@duplojs/lang/path";
declare const unknownInterfaceKind: DKind.Handler<DKind.Definition<"@DuplojsServer/unknownInterface", unknown>>;
export type EntryPath = (string & (DPath.Path | DPath.Absolute | DPath.Segment));
export interface UnknownEntryInterface<GenericPath extends EntryPath = EntryPath> extends DKind.Kind<typeof unknownInterfaceKind> {
    path: GenericPath & DPath.Path;
    getName(): (string & DPath.Segment & DPath.Path) | null;
    getParentPath(): (string & DPath.Path) | null;
    stat(): Promise<StatResult>;
    exist(): Promise<ExistsResult>;
}
export declare function createUnknownEntryInterface<GenericPath extends EntryPath = EntryPath>(path: GenericPath): UnknownEntryInterface<GenericPath>;
export declare function isUnknownEntryInterface<GenericInput extends unknown>(input: GenericInput): input is Extract<GenericInput, UnknownEntryInterface>;
export declare const isUnknownEntryInterfaceFromUnknown: (input: unknown) => input is UnknownEntryInterface;
export {};
