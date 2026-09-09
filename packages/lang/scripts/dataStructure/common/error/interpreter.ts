import * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DObject from "@scripts/object";
import { type Structure, type Structures } from "../../structure";
import { type Type, type Types } from "../../type";
import { type Constraint, type Constraints } from "../../constraint";
import { type Error, type DecodeIssue, type EncodeIssue, type Issue, issueKind, encodeIssueKind } from "./base";
import { type Codec } from "../codec";

export interface InterpretedMessage {
	source?: string;
	interpretedSource?: string;
	subSource?: string;
	interpretedSubSource?: string;

}

export interface InterpretedIssue extends Issue {
	interpretedMessage: InterpretedMessage;
}

export interface InterpretedEncodedIssue extends EncodeIssue {
	interpretedMessage: InterpretedMessage;
}

export interface InterpretedDecodedIssue extends DecodeIssue {
	interpretedMessage: InterpretedMessage;
}

export type InterpretedIssues = (
	| InterpretedIssue
	| InterpretedEncodedIssue
	| InterpretedDecodedIssue
);

export type StructureDictionaryParams = DCommon.SimplifyTopLevel<
	Omit<
		& {
			[
			DataStructure in (
				| Types
				| Structures
				| Constraints
			) as DKind.GetName<DataStructure>
			]?: (structure: DataStructure, issue: Issue) => string
		},
		| DKind.GetName<Type>
		| DKind.GetName<Structure>
		| DKind.GetName<Constraint>
	>
>;

export type CodecDictionaryParams = [
	Codec,
	(
		codec: Codec,
		issue: EncodeIssue | DecodeIssue,
	) => string,
][];

export function createErrorInterpreter(
	structureDictionary: StructureDictionaryParams = {},
	codecDictionary: CodecDictionaryParams = [],
): (error: Error) => readonly InterpretedIssues[] {
	const formattedStructureDictionary = DCommon.pipe(
		structureDictionary,
		DObject.entries,
		DArray.map(
			([key, value]) => DObject.entry(
				`${DKind.keyKindPrefix}${key}`,
				value,
			),
		),
	);
	const getInterpretedMessageStructure = (structure: Structure | Type | Constraint, issue: Issue) => DArray.reduce(
		formattedStructureDictionary,
		DArray.reduceFrom(undefined),
		({ element: [key, getMessage], next, exit }) => getMessage && key in structure
			? exit(getMessage(structure as never, issue))
			: next(undefined),
	);
	const getInterpretedMessageCodec = (
		codec: Codec,
		issue: EncodeIssue | DecodeIssue,
	) => DArray.reduce(
		codecDictionary,
		DArray.reduceFrom(undefined),
		({ element: [currentCodec, message], next, exit }) => currentCodec === codec
			? exit(message(codec, issue))
			: next(undefined),
	);

	return (error) => DArray.map(
		error.issues,
		(issue) => {
			if (issueKind.has(issue)) {
				const source = issue.getSource();
				const subSource = issue.getSubSource?.();

				return ({
					...issue,
					interpretedMessage: {
						source: source.definition.message,
						subSource: subSource?.definition.message,
						interpretedSource: getInterpretedMessageStructure(source, issue),
						interpretedSubSource: subSource && getInterpretedMessageStructure(subSource, issue),
					},
				}) satisfies InterpretedIssue;
			}

			if (encodeIssueKind.has(issue)) {
				return ({
					...issue,
					interpretedMessage: {
						source: issue.message,
						interpretedSource: getInterpretedMessageCodec(issue.getSource(), issue),
					},
				}) satisfies InterpretedEncodedIssue;
			}

			return ({
				...issue,
				interpretedMessage: {
					source: issue.message,
					interpretedSource: getInterpretedMessageCodec(issue.getSource(), issue),
				},
			}) satisfies InterpretedDecodedIssue;
		},
	);
}

export type ErrorInterpreter = ReturnType<typeof createErrorInterpreter>;
