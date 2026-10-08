import { createKind } from "./kind";
import * as DKind from "@scripts/kind";
import { type AnyAbstractConstructor } from "./types";

export const duploJSErrorKind = createKind<"duplojs-error", string>("duplojs-error");

export abstract class DuploJSError<
	GenericIdentifier extends string = string,
	GenericCause extends Error | string = Error | string,
> extends DKind.parentClass(
		duploJSErrorKind,
		Error,
	)<
		GenericIdentifier,
		Error
	> {
	public override cause: GenericCause extends Error
		? GenericCause
		: undefined;

	public constructor(
		identifier: GenericIdentifier,
		cause: GenericCause,
	) {
		super(
			identifier,
			typeof cause === "string"
				? cause
				: "Error received.",
			{
				cause: cause instanceof Error
					? cause
					: undefined,
			},
		);

		this.cause = (
			cause instanceof Error
				? cause
				: undefined
		) as never;
	}

	public static parentClass<
		GenericIdentifier extends string,
	>(
		identifier: GenericIdentifier,
	): abstract new(
		error: string
	) => (
		& DuploJSError<
			GenericIdentifier,
			string
		>
		& DKind.Kind<DKind.Handler<DKind.Definition<`@${DKind.GetNamespaceName<typeof createKind>}/duplojs-error-${GenericIdentifier}`>>>
	);

	public static parentClass<
		GenericIdentifier extends string,
		GenericCauseConstructor extends AnyAbstractConstructor<any[], Error>,
	>(
		identifier: GenericIdentifier,
		causeConstructor: GenericCauseConstructor,
	): abstract new(
		error: InstanceType<GenericCauseConstructor>
	) => (
		& DuploJSError<
			GenericIdentifier,
			InstanceType<GenericCauseConstructor>
		>
		& DKind.Kind<DKind.Handler<DKind.Definition<`@${DKind.GetNamespaceName<typeof createKind>}/duplojs-error-${GenericIdentifier}`>>>
	);

	public static parentClass(
		identifier: string,
		causeConstructor?: Error,
	) {
		abstract class LocalDuploJSError extends DKind.parentClass(
			createKind(`duplojs-error-${identifier}`),
			DuploJSError,
		) {
			public constructor(
				error: string | Error,
			) {
				super(null, identifier, error);
			}
		}

		return LocalDuploJSError as never;
	}
}

