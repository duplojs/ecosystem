import { Constraint } from '../../constraint';
import { Structure } from '../../structure';
import { Type } from '../../type';
import { Codec } from '../codec';
import type * as DCommon from '../../../common';
import * as DKind from '../../../kind';
export declare const issueKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/issue", unknown>>;
export interface Issue extends DKind.Kind<typeof issueKind> {
    readonly path: string;
    readonly data: unknown;
    getSource(): Structure;
    getSubSource?(): (Type | Constraint);
}
export declare const encodeIssueKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/encode-issue", unknown>>;
export interface EncodeIssue extends DKind.Kind<typeof encodeIssueKind> {
    readonly from: "encoding" | "predicate" | "external";
    readonly path: string;
    readonly data: unknown;
    readonly message?: string;
    getSource(): Codec;
}
export declare const decodeIssueKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/decode-issue", unknown>>;
export interface DecodeIssue extends DKind.Kind<typeof decodeIssueKind> {
    readonly from: "decoding" | "predicate" | "external";
    readonly path: string;
    readonly data: unknown;
    readonly message?: string;
    getSource(): Codec;
}
export type Issues = (Issue | EncodeIssue | DecodeIssue);
export interface PathStageErrorHandler {
    setCurrentPath(path: string): void;
    close(): void;
}
declare const Error_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/error", unknown>>, ErrorConstructor>;
export declare class Error extends Error_base {
    readonly issues: readonly Issues[];
    constructor(issues: readonly Issues[]);
}
declare const ErrorPromise_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/error-promise", unknown>>, ErrorConstructor>;
export declare class ErrorPromise extends ErrorPromise_base {
    constructor();
}
export interface ErrorHandler {
    readonly issues: readonly Issues[];
    readonly currentPath: string[];
    addIssue(source: ReturnType<Issue["getSource"]>, data: unknown, subSource?: ReturnType<Extract<Issue["getSubSource"], DCommon.AnyFunction>>): void;
    addEncodeIssue(source: ReturnType<EncodeIssue["getSource"]>, from: EncodeIssue["from"], data: unknown, message?: string): void;
    addDecodeIssue(source: ReturnType<DecodeIssue["getSource"]>, from: DecodeIssue["from"], data: unknown, message?: string): void;
    importIssues(errorHandler: (GetErrorHandler | ErrorHandler)[]): void;
    createPathStage(): PathStageErrorHandler;
    createError(): Error;
}
export declare function createErrorHandler(defaultPath?: string[]): ErrorHandler;
export type GetErrorHandler = () => ErrorHandler;
export declare function createGetErrorHandler(defaultPath?: string[]): GetErrorHandler;
export {};
