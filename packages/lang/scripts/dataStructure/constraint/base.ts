import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol } from "../common";

export const constraintKind = createKind("constraint");

export interface ConstraintDefinition {
	readonly message?: string;
}

declare const BivariousSymbol: unique symbol;

export interface Constraint<
	GenericInput extends unknown = unknown,
	GenericChecked extends GenericInput = GenericInput,
	GenericDefinition extends ConstraintDefinition = ConstraintDefinition,
> extends DKind.Kind<
		typeof constraintKind,
		DCommon.IsEqual<GenericInput, GenericChecked> extends true
			? any
			: GenericChecked
	> {
	readonly definition: GenericDefinition;
	readonly [BivariousSymbol]?: DCommon.IsUnion<GenericInput> extends true
		? (input: GenericInput) => void
		: unknown;
	executeCheck(
		data: GenericInput,
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(): boolean;
	clone(): this;
	setMessage(massage: string): this;
	addMessage(massage: string): this;
}

export interface CreateConstraintInitParams<
	GenericConstraint extends Constraint = Constraint,
> {
	executeCheck(
		self: GenericConstraint,
		data: Parameters<GenericConstraint["executeCheck"]>[0],
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	isAsynchronous(self: GenericConstraint): boolean;
}

export class ConstraintBase {
	private constructor() {}

	public static init(params: DKind.Remove<Constraint>) {
		const self = new ConstraintBase();
		DCommon.bindPrototypeMethods(self);
		for (const key in params) {
			self[key as never] = params[key as never];
		}

		return self as Constraint;
	}

	public static addToPrototype<
		GenericProp extends keyof Constraint,
	>(
		prop: GenericProp,
		value: Constraint[GenericProp] extends infer InferredValue
			? InferredValue extends DCommon.AnyFunction
				? (self: Constraint, ...rest: Parameters<InferredValue>) => ReturnType<InferredValue>
				: Constraint[GenericProp]
			: never,
	) {
		ConstraintBase.prototype[prop as never] = (
			typeof value === "function"
				? function(this: never, ...args: never[]) {
					return (value as DCommon.AnyFunction)(this as never, ...args);
				}
				: value
		) as never;
	}
}

export interface CreateConstraintConstructorParams<
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericConstraint extends (
			& Constraint
			& DKind.Kind<GenericKindHandler>
		),
	>(
		definition: GenericConstraint["definition"],
		params: CreateConstraintInitParams<GenericConstraint>,
	): GenericConstraint;
}

export function createConstraint<
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& Constraint
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateConstraintConstructorParams<
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	const init: CreateConstraintConstructorParams["init"] = (
		definition,
		{
			executeCheck,
			isAsynchronous,
		},
	) => {
		const self = ConstraintBase.init({
			definition,
			executeCheck: (data: unknown) => executeCheck(
				self as never,
				data,
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
			[constraintKind.runTimeKey]: null,
			[kindHandler.runTimeKey]: null,
		} satisfies DKind.Remove<Constraint>);

		return self as never;
	};

	return createConstructor({
		init,
	});
}
