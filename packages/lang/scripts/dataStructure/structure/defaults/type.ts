import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type Constraint } from "../../constraint";
import { type TypeValue, type Type } from "../../type";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const typeStructureKind = createKind("type-structure");

export interface TypeStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly type: Type;
}

export interface TypeStructure<
	out GenericType extends unknown = unknown,
	out GenericConstraints extends readonly Constraint<GenericType>[] =
		readonly Constraint<GenericType>[],
> extends DCommon.Forward<
		& Structure<
			GenericType,
			TypeStructureDefinition<GenericConstraints>
		>
		& DKind.Kind<typeof typeStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<TypeValue<GenericType>>>,
	>(
		...args: GenericNewConstraints
	): TypeStructure<
		GenericType,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const TypeStructure = createStructure(
	typeStructureKind,
	({ init }) => <
		GenericType extends Type,
		const GenericConstraints extends readonly Constraint<
			TypeValue<GenericType>
		>[],
	>(
		type: GenericType,
		constraints: GenericConstraints,
	) => init<
		TypeStructure<
			TypeValue<GenericType>,
			readonly [...GenericConstraints]
		>
	>(
		{
			type,
			constraints: constraints,
		},
		{
			executeCheck: (self, data, errorHandler) => DCommon.callThen(
				self.definition.type.executeCheck(data),
				(result) => result === ErrorSymbol
					? errorHandler?.().addIssue(self, data, self.definition.type) ?? ErrorSymbol
					: SuccessSymbol,
			),
			executeEncode: (self, codecContext, data, errorHandler) => DCommon.callThen(
				self.executeCheck(data, errorHandler),
				(result) => {
					if (result === ErrorSymbol) {
						return ErrorSymbol;
					}

					const codec = codecContext.get(self.definition.type.fundamentalType);

					return codec
						? codec.encode(data, errorHandler)
						: data;
				},
			),
			executeDecode: (self, codecContext, data, errorHandler) => {
				const codec = codecContext.get(self.definition.type.fundamentalType);

				return DCommon.callThen(
					codec
						? codec.decode(data, errorHandler)
						: data,
					(decodedData) => decodedData === ErrorSymbol
						? ErrorSymbol
						: DCommon.callThen(
							self.executeCheck(decodedData, errorHandler),
							(result) => result === ErrorSymbol
								? ErrorSymbol
								: decodedData,
						),
				);
			},
			isAsynchronous: (self) => self.definition.type.isAsynchronous(),
		},
	),
);
