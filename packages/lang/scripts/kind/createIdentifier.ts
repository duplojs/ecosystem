import type * as DCommon from "@scripts/common";
import { type Kind, type Handler } from "./base";
import { type GetHandler } from "./types";

type KindIdentifierHandlers<
	GenericParent extends Kind<Handler>,
	GenericChildren extends GenericParent,
> = GenericChildren extends infer InferredChildren
	? InferredChildren extends GenericParent
		? GetHandler<InferredChildren>
		: never
	: never;

type KindIdentifierResult<
	GenericParent extends Kind<Handler>,
	GenericChildren extends GenericParent,
	GenericInput extends unknown,
	GenericGroupedKind extends unknown,
> = (
	| (
		GenericInput extends GenericParent
			? GenericChildren extends GenericInput
				? GenericChildren extends GenericGroupedKind
					? GenericChildren
					: never
				: never
			: never
	)
	| Extract<GenericInput, GenericGroupedKind>
);

export interface KindIdentifier<
	GenericParent extends Kind<Handler>,
	GenericChildren extends GenericParent,
> {
	<
		GenericKindHandler extends KindIdentifierHandlers<GenericParent, GenericChildren>,
		GenericInput extends unknown,
		GenericGroupedKind extends DCommon.Forward<
			GenericKindHandler extends Handler
				? Kind<GenericKindHandler>
				: never
		>,
	>(
		kind: GenericKindHandler | GenericKindHandler[],
	): (
		input: GenericInput,
	) => input is KindIdentifierResult<
		GenericParent,
		GenericChildren,
		GenericInput,
		GenericGroupedKind
	>;

	<
		GenericKindHandler extends KindIdentifierHandlers<GenericParent, GenericChildren>,
		GenericInput extends unknown,
		GenericGroupedKind extends DCommon.Forward<
			GenericKindHandler extends Handler
				? Kind<GenericKindHandler>
				: never
		>,
	>(
		input: GenericInput,
		kind: GenericKindHandler | GenericKindHandler[],
	): input is KindIdentifierResult<
		GenericParent,
		GenericChildren,
		GenericInput,
		GenericGroupedKind
	>;
}

export function createKindIdentifier<
	GenericParent extends Kind<Handler>,
	GenericChildren extends GenericParent,
>(): KindIdentifier<GenericParent, GenericChildren> {
	function identifier(
		...args:
			| [input: unknown, kind: Handler | Handler[]]
			| [kind: Handler | Handler[]]
	): any {
		if (args.length === 1) {
			const [kind] = args;

			return (input: unknown) => identifier(input, kind);
		}

		const [input, kind] = args;

		const formattedKind = kind instanceof Array
			? kind
			: [kind];

		for (const kind of formattedKind) {
			if (!kind.has(input)) {
				return false;
			}
		}

		return true;
	}

	return identifier as KindIdentifier<GenericParent, GenericChildren>;
}
