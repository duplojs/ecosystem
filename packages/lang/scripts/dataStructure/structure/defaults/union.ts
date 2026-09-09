import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type Constraint } from "../../constraint";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { createGetErrorHandler, ErrorSymbol, SuccessSymbol, type GetErrorHandler } from "../../common";
import { type StructureValue } from "../types";
import { structureIdentifier } from "../identifier";
import { lazyStructureKind } from "./lazy";

export const unionStructureKind = createKind("union-structure");

export interface UnionStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly values: DCommon.Memoized<DCommon.AnyTuple<Structure>>;
}

export interface UnionStructure<
	out GenericValue extends unknown = unknown,
	out GenericConstraints extends readonly Constraint<GenericValue>[] =
		readonly Constraint<GenericValue>[],
> extends DCommon.Forward<
		& Structure<GenericValue, UnionStructureDefinition<GenericConstraints>>
		& DKind.Kind<typeof unionStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): UnionStructure<
		GenericValue,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const UnionStructure = createStructure(
	unionStructureKind,
	({ init }) => <
		GenericValues extends DCommon.AnyTuple<Structure>,
		const GenericConstraints extends readonly Constraint<
			StructureValue<GenericValues[number]>
		>[],
	>(
		values: GenericValues,
		constraints: GenericConstraints,
	) => init<
		UnionStructure<
			StructureValue<GenericValues[number]>,
			readonly [...GenericConstraints]
		>
	>(
		{
			values: DCommon.memo(
				() => values.flatMap<Structure>(
					(value) => (function flatUnion(structure: Structure): Structure | Structure[] {
						if (structureIdentifier(structure, unionStructureKind)) {
							return structure.definition.values.value.flatMap(
								flatUnion,
							);
						}

						if (structureIdentifier(structure, lazyStructureKind)) {
							return flatUnion(structure.definition.getter.value);
						}

						return structure;
					})(value),
				),
			) as never,
			constraints,
		},
		{
			executeCheck: (self, data, errorHandler) => {
				const errorHandlers: GetErrorHandler[] | undefined = errorHandler ? [] : undefined;

				const result = self.definition.values.value.reduce<
					DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
				>(
					(accumulator, value, index) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => {
							if (awaitedAccumulator === SuccessSymbol) {
								return awaitedAccumulator;
							}

							const subErrorHandler = errorHandler === undefined
								? undefined
								: createGetErrorHandler(errorHandler().currentPath);

							if (errorHandlers && subErrorHandler) {
								subErrorHandler().createPathStage().setCurrentPath(`(union: ${index})`);
								errorHandlers.push(subErrorHandler);
							}

							return value.executeCheck(data, subErrorHandler);
						},
					),
					ErrorSymbol,
				);

				return DCommon.callThen(
					result,
					(awaitedResult) => {
						if (awaitedResult === ErrorSymbol) {
							if (errorHandlers) {
								errorHandler?.().importIssues(errorHandlers);
							}
							errorHandler?.().addIssue(self, data);

							return ErrorSymbol;
						}

						return SuccessSymbol;
					},
				);
			},
			executeEncode: (self, codec, data, errorHandler) => {
				const errorHandlers: GetErrorHandler[] | undefined = errorHandler ? [] : undefined;

				const encodedData = self.definition.values.value.reduce<unknown>(
					(accumulator, value, index) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => {
							if (awaitedAccumulator !== ErrorSymbol) {
								return awaitedAccumulator;
							}

							const subErrorHandler = errorHandler === undefined
								? undefined
								: createGetErrorHandler(errorHandler().currentPath);

							if (errorHandlers && subErrorHandler) {
								subErrorHandler().createPathStage().setCurrentPath(`(union: ${index})`);
								errorHandlers.push(subErrorHandler);
							}

							return value.executeEncode(codec, data, subErrorHandler);
						},
					),
					ErrorSymbol,
				);

				return DCommon.callThen(
					encodedData,
					(awaitedEncodedData) => {
						if (awaitedEncodedData === ErrorSymbol) {
							if (errorHandlers) {
								errorHandler?.().importIssues(errorHandlers);
							}
							errorHandler?.().addIssue(self, data);

							return ErrorSymbol;
						}

						return DCommon.callThen(
							self.executeConstraints(data, errorHandler),
							(result) => result === ErrorSymbol
								? ErrorSymbol
								: awaitedEncodedData,
						);
					},
				);
			},
			executeDecode: (self, codec, data, errorHandler) => {
				const errorHandlers: GetErrorHandler[] | undefined = errorHandler ? [] : undefined;

				const decodedData = self.definition.values.value.reduce<unknown>(
					(accumulator, value, index) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => {
							if (awaitedAccumulator !== ErrorSymbol) {
								return awaitedAccumulator;
							}

							const subErrorHandler = errorHandler === undefined
								? undefined
								: createGetErrorHandler(errorHandler().currentPath);

							if (errorHandlers && subErrorHandler) {
								subErrorHandler().createPathStage().setCurrentPath(`(union: ${index})`);
								errorHandlers.push(subErrorHandler);
							}

							return value.executeDecode(codec, data, subErrorHandler);
						},
					),
					ErrorSymbol,
				);

				return DCommon.callThen(
					decodedData,
					(awaitedDecodedData) => {
						if (awaitedDecodedData === ErrorSymbol) {
							if (errorHandlers) {
								errorHandler?.().importIssues(errorHandlers);
							}
							errorHandler?.().addIssue(self, data);

							return ErrorSymbol;
						}

						return DCommon.callThen(
							self.executeConstraints(awaitedDecodedData, errorHandler),
							(result) => result === ErrorSymbol
								? ErrorSymbol
								: awaitedDecodedData,
						);
					},
				);
			},
			isAsynchronous: (self) => self.definition.values.value.some(
				(value) => value.isAsynchronous(),
			),
		},
	),
);
