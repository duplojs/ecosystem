import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { createKind } from "../../kind";
import { createStructure, type Structure, type StructureDefinition } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const nonEncodableStringStructureKind = createKind("non-encodable-string-structure");

export interface NonEncodableStringStructureDefinition extends StructureDefinition<
	readonly []
> {
	readonly value: string;
}

export interface NonEncodableStringStructure extends DCommon.Forward<
	& Structure<
		// oxlint-disable-next-line typescript/no-wrapper-object-types
		String,
		NonEncodableStringStructureDefinition
	>
	& DKind.Kind<typeof nonEncodableStringStructureKind>
> {

}

export const NonEncodableStringStructure = createStructure(
	nonEncodableStringStructureKind,
	({ init }) => (
		value: string,
	) => init<
		NonEncodableStringStructure
	>(
		{
			value,
			constraints: [],
		},
		{
			executeCheck: (self, data, errorHandler) => data === self.definition.value
				? SuccessSymbol
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			executeEncode: (self, codecContext, data, errorHandler) => data === self.definition.value
				? data
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			executeDecode: (self, codecContext, data, errorHandler) => data === self.definition.value
				? data
				: errorHandler?.().addIssue(self, data) ?? ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
