import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { type Constraint } from "../../constraint";
import { type Structure } from "../../structure";
import { type Type } from "../../type";
import { type Codec } from "../codec";
import { createKind } from "../../kind";

export const issueKind = createKind("issue");
export interface Issue extends DKind.Kind<typeof issueKind> {
	readonly path: string;
	readonly data: unknown;
	getSource(): Structure;
	getSubSource?(): (
		| Type
		| Constraint
	);
}

export const encodeIssueKind = createKind("encode-issue");
export interface EncodeIssue extends DKind.Kind<typeof encodeIssueKind> {
	readonly from: "encoding" | "predicate" | "external";
	readonly path: string;
	readonly data: unknown;
	readonly message?: string;
	getSource(): Codec;
}

export const decodeIssueKind = createKind("decode-issue");
export interface DecodeIssue extends DKind.Kind<typeof decodeIssueKind> {
	readonly from: "decoding" | "predicate" | "external";
	readonly path: string;
	readonly data: unknown;
	readonly message?: string;
	getSource(): Codec;
}

export type Issues = (
	| Issue
	| EncodeIssue
	| DecodeIssue
);

export interface PathStageErrorHandler {
	setCurrentPath(path: string): void;
	close(): void;
}

export interface Error {
	readonly issues: readonly Issues[];
}

export interface ErrorHandler {
	readonly issues: readonly Issues[];
	readonly currentPath: string[];
	addIssue(
		source: ReturnType<Issue["getSource"]>,
		data: unknown,
		subSource?: ReturnType<Extract<Issue["getSubSource"], DCommon.AnyFunction>>
	): void;
	addEncodeIssue(
		source: ReturnType<EncodeIssue["getSource"]>,
		from: EncodeIssue["from"],
		data: unknown,
		message?: string
	): void;
	addDecodeIssue(
		source: ReturnType<DecodeIssue["getSource"]>,
		from: DecodeIssue["from"],
		data: unknown,
		message?: string
	): void;
	importIssues(errorHandler: (GetErrorHandler | ErrorHandler)[]): void;
	createPathStage(): PathStageErrorHandler;
	createError(): Error;
}

export function createErrorHandler(defaultPath?: string[]): ErrorHandler {
	const issues: Issues[] = [];
	const currentPath: string[] = defaultPath
		? [...defaultPath]
		: [];
	let currentStagePath = currentPath.length - 1;

	let currentStage: PathStageErrorHandler | undefined = undefined;

	return {
		currentPath,
		issues,
		createPathStage: () => {
			if (currentStage === undefined) {
				currentStage = {
					setCurrentPath: (path: string) => {
						currentPath[currentStagePath] = path;
					},
					close: () => {
						if (currentStagePath === -1) {
							return;
						}

						if (currentPath.length !== currentStagePath) {
							currentPath.pop();
						}

						currentStagePath--;
					},
				};
			}
			currentStagePath++;

			return currentStage;
		},
		addIssue: (source, data, subSource) => {
			issues.push({
				data,
				path: currentPath.join("."),
				getSource: () => source,
				getSubSource: subSource
					? () => subSource
					: undefined,
				[issueKind.runTimeKey]: null,
			} satisfies DKind.Remove<Issue> as never);
		},
		addEncodeIssue: (source, from, data, message) => {
			issues.push({
				from,
				data,
				path: currentPath.join("."),
				message,
				getSource: () => source,
				[encodeIssueKind.runTimeKey]: null,
			} satisfies DKind.Remove<EncodeIssue> as never);
		},
		addDecodeIssue: (source, from, data, message) => {
			issues.push({
				from,
				data,
				path: currentPath.join("."),
				message,
				getSource: () => source,
				[decodeIssueKind.runTimeKey]: null,
			} satisfies DKind.Remove<DecodeIssue> as never);
		},
		createError: () => ({ issues }),
		importIssues: (errorHandler) => void errorHandler.forEach(
			(value) => void issues.push(
				...(
					typeof value === "function"
						? value().issues
						: value.issues
				),
			),
		),
	};
}

export type GetErrorHandler = () => ErrorHandler;

export function createGetErrorHandler(defaultPath?: string[]): GetErrorHandler {
	let errorHandler: undefined | ErrorHandler = undefined;

	return () => {
		if (errorHandler === undefined) {
			errorHandler = createErrorHandler(defaultPath);
		}

		return errorHandler;
	};
}
