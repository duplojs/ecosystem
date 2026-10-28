import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DArray from "@duplojs/lang/array";
import { findOptionToken, optionKind, type Option } from "../base";
import { createKind } from "@scripts/command/kind";
import type { ForbiddenInvalidIdentifier } from "../../types";

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

export interface CreateBooleanOptionParams<
	GenericAliases extends readonly string[] = readonly string[],
> {
	description?: string;
	aliases?: (
		& GenericAliases
		& {
			readonly [Index in keyof GenericAliases]: ForbiddenInvalidIdentifier<GenericAliases[Index]>
		}
	);
}

export function createBooleanOption<
	GenericName extends string,
	const GenericAliases extends readonly string[] = readonly string[],
>(
	name: GenericName & ForbiddenInvalidIdentifier<GenericName>,
	params?: CreateBooleanOptionParams<GenericAliases>,
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
