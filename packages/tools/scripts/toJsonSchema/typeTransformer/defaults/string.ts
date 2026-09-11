import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import { createTypeTransformer } from "../create";

export interface JsonSchemaString {
	type: "string" | ("string" | "number" | "boolean" | "null")[];
	pattern?: string;
	format?: "uri" | "email" | "uuid" | "path" | "absolute-path" | "segment-path";
	minLength?: number;
	maxLength?: number;
	allOf?: readonly Omit<JsonSchemaString, "type" | "allOf" | "anyOf">[];
	anyOf?: readonly Omit<JsonSchemaString, "type" | "allOf" | "anyOf">[];
}

export const stringTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.stringTypeKind),
	(
		_type,
		constraints,
		{
			success,
		},

	) => DCommon.pipe(
		constraints,
		DArray.reduce(
			DArray.reduceFrom<JsonSchemaString>({ type: "string" }),
			({
				element: constraint,
				lastValue,
				nextWithObject,
				next,
			}) => DPattern.match(constraint)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.minCharactersConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						{ minLength: definition.min },
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.maxCharactersConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						{ maxLength: definition.max },
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.stringLengthEqualConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						{
							minLength: definition.length,
							maxLength: definition.length,
						},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.urlConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						{
							format: "uri",
						},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.emailConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								format: "email",
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: DString.uuidRegex.source,
									},
								],
							}
							: {
								format: "email",
								pattern: DString.uuidRegex.source,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.uuidConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								format: "uuid",
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: DString.uuidRegex.source,
									},
								],
							}
							: {
								format: "uuid",
								pattern: DString.uuidRegex.source,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.notEmptyConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								minLength: lastValue.minLength ?? 1,
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: "^\\S.*\\S$|^\\S$",
									},
								],
							}
							: {
								minLength: lastValue.minLength ?? 1,
								pattern: "^\\S.*\\S$|^\\S$",
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.trimmedConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								minLength: lastValue.minLength ?? 1,
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: "^\\S(.*\\S)?$",
									},
								],
							}
							: {
								minLength: lastValue.minLength ?? 1,
								pattern: "^\\S(.*\\S)?$",
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.regexConstraintKind,
					),
					({ definition }) => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: definition.regex.source,
									},
								],
							}
							: {
								pattern: definition.regex.source,
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.absolutePathConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								format: "absolute-path",
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: "^(?!.*\\u0000)(?!.*//)(?!.*(?:^|/)\\.(?:/|$))(?!.*(?:^|/)\\.\\.(?:/|$))(?:/|/.*[^/])$",
									},
								],
							}
							: {
								format: "absolute-path",
								pattern: "^(?!.*\\u0000)(?!.*//)(?!.*(?:^|/)\\.(?:/|$))(?!.*(?:^|/)\\.\\.(?:/|$))(?:/|/.*[^/])$",
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.pathConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								format: "path",
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: "^(?:\\.|/|(?!.*\\u0000)(?!.*//)(?!.*/$)(?!.*(?:^|/)\\.(?:/|$))(?:(?=/)(?!.*(?:^|/)\\.\\.(?:/|$)).+|(?!/)(?!.*(?:^|/)(?!\\.\\.(?:/|$))[^/]+/\\.\\.(?:/|$)).+))$",
									},
								],
							}
							: {
								format: "path",
								pattern: "^(?:\\.|/|(?!.*\\u0000)(?!.*//)(?!.*/$)(?!.*(?:^|/)\\.(?:/|$))(?:(?=/)(?!.*(?:^|/)\\.\\.(?:/|$)).+|(?!/)(?!.*(?:^|/)(?!\\.\\.(?:/|$))[^/]+/\\.\\.(?:/|$)).+))$",
							},
					),
				)
				.when(
					DDataStructure.constraintIdentifier(
						DDataStructure.segmentPathConstraintKind,
					),
					() => nextWithObject(
						lastValue,
						lastValue.pattern
							? {
								format: "segment-path",
								allOf: [
									...(lastValue.allOf ?? []),
									{
										pattern: "^(?!\\.$|\\.\\.$)[^/\\u0000]+$",
									},
								],
							}
							: {
								format: "segment-path",
								pattern: "^(?!\\.$|\\.\\.$)[^/\\u0000]+$",
							},
					),
				)
				.otherwise(() => next(lastValue)),
		),
		success,
	),
);
