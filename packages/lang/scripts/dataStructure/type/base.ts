import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type FundamentalType, type FundamentalTypeValue } from "../fundamentalType";
import { createKind } from "../kind";
import { ErrorSymbol, type SuccessSymbol } from "../common";

export const typeKind = createKind("type");

export interface TypeDefinition {
	readonly message?: string;
}

export interface Type<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericValue extends FundamentalTypeValue<
		GenericFundamentalType
	> = FundamentalTypeValue<GenericFundamentalType>,
	GenericDefinition extends TypeDefinition = TypeDefinition,
> extends DKind.Kind<typeof typeKind, GenericValue> {
	readonly fundamentalType: GenericFundamentalType;
	readonly definition: GenericDefinition;
	executeCheck(
		data: unknown,
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(): boolean;
	clone(): this;
	setMessage(massage: string): this;
	addMessage(massage: string): this;
}

export interface CreateTypeInitParams<
	GenericType extends Type = Type,
	GenericFundamentalType extends FundamentalType = FundamentalType,
> {
	executeCheck(
		self: GenericType,
		data: FundamentalTypeValue<
			GenericFundamentalType
		>,
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(self: GenericType): boolean;
}

export interface CreateTypeConstructorParams<
	GenericFundamentalType extends FundamentalType = FundamentalType,
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericType extends (
			& Type<GenericFundamentalType>
			& DKind.Kind<GenericKindHandler>
		),
	>(
		definition: GenericType["definition"],
		params: CreateTypeInitParams<GenericType, GenericFundamentalType>,
	): GenericType;
}

export function createType<
	GenericFundamentalType extends FundamentalType,
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& Type<GenericFundamentalType>
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	fundamentalType: GenericFundamentalType,
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateTypeConstructorParams<
			GenericFundamentalType,
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	const init: CreateTypeConstructorParams["init"] = (
		definition,
		{
			executeCheck,
			isAsynchronous,
		},
	) => {
		const self: Type = {
			fundamentalType,
			definition,
			executeCheck: (
				data: unknown,
			) => DCommon.callThen(
				self.fundamentalType.executeCheck(data),
				(result) => result === ErrorSymbol
					? ErrorSymbol
					: executeCheck(self as never, data),
			),
			isAsynchronous: () => isAsynchronous(self as never),
			clone: () => init(
				DCommon.simpleClone(definition),
				{
					executeCheck,
					isAsynchronous,
				},
			),
			setMessage: (message) => {
				(self.definition.message as any) = message as any;
				return self;
			},
			addMessage: (message) => {
				const cloneSelf = self.clone();
				return cloneSelf.setMessage(message);
			},
			[typeKind.runTimeKey]: null,
			[kindHandler.runTimeKey]: null,
		} satisfies DKind.Remove<Type> as never;

		return self as never;
	};

	return createConstructor({
		init,
	});
}
