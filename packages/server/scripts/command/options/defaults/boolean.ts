import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DArray from "@duplojs/lang/array";
import { findOptionToken, optionKind, type Option } from "../base";
import { createKind } from "@scripts/command/kind";

export const booleanOptionKind = createKind("command-boolean-option");

export interface BooleanOption<
	GenericName extends string = string,
> extends DCommon.Forward<
		& Option<
			GenericName,
			boolean
		>
		& DKind.Kind<typeof booleanOptionKind>
	> {}

export interface CreateBooleanOptionParams {
	description?: string;
	aliases?: readonly string[];
}

export function createBooleanOption<
	GenericName extends string,
>(
	name: GenericName,
	params?: CreateBooleanOptionParams,
): BooleanOption<GenericName> {
	const self: BooleanOption<GenericName> = {
		name,
		description: params?.description ?? null,
		aliases: params?.aliases ?? [],
		execute: (args, error) => {
			const token = findOptionToken(args, self);

			if (token?.value !== undefined) {
				return Promise.resolve(
					error.addUnexpectedOptionValueIssue(
						self.name,
						token.value,
					),
				);
			}

			return Promise.resolve({
				result: token !== null,
				argumentRest: token
					? DArray.spliceDelete(args, token.index, 1)
					: args,
			});
		},
		[optionKind.runTimeKey]: null,
		[booleanOptionKind.runTimeKey]: null,
	} satisfies DKind.Remove<BooleanOption<GenericName>> as never;

	return self;
}
