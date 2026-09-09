import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type Constraint } from "../../constraint";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { type StructureValue } from "../types";
import { ErrorSymbol } from "../../common";
import { structureIdentifier } from "../identifier";

export const lazyStructureKind = createKind("lazy-structure");

export interface LazyStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly getter: DCommon.Memoized<Structure>;
}

export interface LazyStructure<
	out GenericValue extends unknown = unknown,
	out GenericConstraints extends readonly Constraint<GenericValue>[] =
		readonly Constraint<GenericValue>[],
> extends DCommon.Forward<
		& Structure<GenericValue, LazyStructureDefinition<GenericConstraints>>
		& DKind.Kind<typeof lazyStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): LazyStructure<
		GenericValue,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const LazyStructure = createStructure(
	lazyStructureKind,
	({ init }) => <
		GenericStructure extends Structure,
		const GenericConstraints extends readonly Constraint<
			StructureValue<GenericStructure>
		>[],
	>(
		getStructure: () => GenericStructure,
		constraints: GenericConstraints,
	) => init<
		LazyStructure<
			StructureValue<GenericStructure>,
			readonly [...GenericConstraints]
		>
	>(
		{
			getter: DCommon.memo(() => {
				const dataStructure: Structure = getStructure();

				if (structureIdentifier(dataStructure, lazyStructureKind)) {
					return dataStructure.definition.getter.value;
				}

				return dataStructure;
			}) as never,
			constraints,
		},
		{
			executeCheck: (self, data, errorHandler) => self.definition.getter.value.executeCheck(
				data,
				errorHandler,
			),
			executeEncode: (self, codecContext, data, errorHandler) => DCommon.callThen(
				self.definition.getter.value.executeEncode(
					codecContext,
					data,
					errorHandler,
				),
				(encodedData) => encodedData === ErrorSymbol
					? ErrorSymbol
					: DCommon.callThen(
						self.executeConstraints(data, errorHandler),
						(result) => result === ErrorSymbol
							? ErrorSymbol
							: encodedData,
					),
			),
			executeDecode: (self, codecContext, data, errorHandler) => DCommon.callThen(
				self.definition.getter.value.executeDecode(
					codecContext,
					data,
					errorHandler,
				),
				(decodedData) => decodedData === ErrorSymbol
					? ErrorSymbol
					: DCommon.callThen(
						self.executeConstraints(decodedData, errorHandler),
						(result) => result === ErrorSymbol
							? ErrorSymbol
							: decodedData,
					),
			),
			isAsynchronous: (self) => self.definition.getter.value.isAsynchronous(),
		},
	),
);
