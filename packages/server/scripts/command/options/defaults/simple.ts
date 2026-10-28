import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DEither from "@duplojs/lang/either";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@scripts/dataStructure";
import { constructOption, type Option } from "../base";
import type { EligibleType, ForbiddenInvalidIdentifier } from "../../types";
import { createKind } from "@scripts/command/kind";

export const simpleOptionKind = createKind("command-simple-option");

export interface SimpleOption<
	GenericName extends string = string,
	GenericValue extends EligibleType = EligibleType,
> extends DCommon.Forward<
		& Option<
			GenericName,
			GenericValue
		>
		& DKind.Kind<typeof simpleOptionKind>
	> {
	readonly dataStructure: DDataStructure.Structure<GenericValue>;
	readonly required: boolean;
}

export interface CreateSimpleOptionParams<
	GenericAliases extends readonly string[] = readonly string[],
> {
	description?: string;
	aliases?: (
		& GenericAliases
		& {
			readonly [Index in keyof GenericAliases]: ForbiddenInvalidIdentifier<GenericAliases[Index]>
		}
	);
	required?: boolean;
}

export const createOption = constructOption(
	simpleOptionKind,
	({ init }) => <
		GenericName extends string,
		GenericStructure extends DDataStructure.Structure<EligibleType>,
		GenericValue extends DDataStructure.StructureValue<GenericStructure>,
		const GenericAliases extends readonly string[] = readonly string[],
		const GenericParams extends CreateSimpleOptionParams<GenericAliases> = {},
	>(
		name: GenericName & ForbiddenInvalidIdentifier<GenericName>,
		dataStructure: GenericStructure,
		params?: GenericParams & CreateSimpleOptionParams<GenericAliases>,
	): SimpleOption<
		GenericName,
		(
			| GenericValue
			| (
				DCommon.IsEqual<GenericParams["required"], true> extends true
					? never
					: undefined
			)
		)
	> => init<SimpleOption>(
		name,
		async(self, value, error) => {
			if (value === null && self.required === true) {
				return error.addRequiredOptionIssue(
					self.name,
				);
			}

			if (value === null) {
				return undefined;
			}

			if (value === undefined) {
				return error.addRequiredOptionValueIssue(
					self.name,
				);
			}

			const result = await self.dataStructure.asyncDecode(
				DSDataStructure.codecsString,
				value,
			);

			if (DEither.isLeft(result)) {
				return error.addDataStructureOptionIssue(
					self.name,
					value,
					DEither.unwrapLeft(result),
				);
			}

			return DEither.unwrapRight(result);
		},
		{
			description: params?.description ?? null,
			aliases: params?.aliases ?? [],
		},
		{
			dataStructure: dataStructure,
			required: params?.required ?? false,
		},
	) as never,
);
