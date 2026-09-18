import { createKind } from "@core/kind";
import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";

export const metadataKind = createKind<
	"metadata",
	{
		name: string;
		value: unknown;
	}
>("metadata");

export interface Metadata<
	GenericName extends string = string,
	GenericValue extends unknown = unknown,
> extends DKind.Kind<
		typeof metadataKind,
		{
			name: GenericName;
			value: GenericValue;
		}
	> {

}

export interface MetadataHandler<
	GenericName extends string,
	GenericValue extends unknown,
> {
	dataName: GenericName;

	<
		GenericMetadataValue extends GenericValue,
	>(
		...args: DCommon.Or<[
			DCommon.IsEqual<GenericValue, unknown>,
			DCommon.IsEqual<GenericValue, never>,
			DCommon.IsExtends<undefined, GenericValue>,
		]> extends true
			? [value?: GenericMetadataValue]
			: [value: GenericMetadataValue]
	): Metadata<GenericName, GenericMetadataValue>;

	is(
		input: unknown
	): input is Metadata<GenericName, any>;

	getValue(
		input: Metadata<GenericName, GenericValue>
	): GenericValue;
}

export function createMetadata<
	GenericName extends string,
	GenericValue extends unknown = unknown,
>(
	name: GenericName,
): MetadataHandler<
	GenericName,
	GenericValue
> {
	function metadataHandler(value: GenericValue) {
		return metadataKind.setTo(
			{},
			{
				name,
				value,
			},
		);
	}

	metadataHandler.dataName = name;

	metadataHandler.is = function(input: Metadata) {
		return metadataKind.has(input)
		&& metadataKind.getValue(input).name === name;
	};

	metadataHandler.getValue = (
		input: Metadata,
	) => metadataKind.getValue(input).value;

	return metadataHandler as never;
}
