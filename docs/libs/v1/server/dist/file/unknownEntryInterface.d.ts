import { StatResult } from './stat';
import { ExistsResult } from './exists';
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DPath from "@duplojs-v1/lang/path";
declare const unknownInterfaceKind: DKind.Handler<DKind.Definition<"@DuplojsServer/unknownInterface", unknown>>;
export interface UnknownEntryInterface extends DKind.Kind<typeof unknownInterfaceKind> {
    path: string & DPath.Path;
    getName(): (string & DPath.Segment) | null;
    getParentPath(): (string & DPath.Path) | null;
    stat(): Promise<StatResult>;
    exist(): Promise<ExistsResult>;
}
export declare function createUnknownEntryInterface(path: string & DPath.Path): UnknownEntryInterface;
export declare function isUnknownEntryInterface(input: unknown): input is UnknownEntryInterface;
export {};
