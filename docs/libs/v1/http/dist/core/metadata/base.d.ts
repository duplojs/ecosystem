import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
export declare const metadataKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/metadata", {
    name: string;
    value: unknown;
}>>;
export interface Metadata<GenericName extends string = string, GenericValue extends unknown = unknown> extends DKind.Kind<typeof metadataKind, {
    name: GenericName;
    value: GenericValue;
}> {
}
export interface MetadataHandler<GenericName extends string, GenericValue extends unknown> {
    dataName: GenericName;
    <GenericMetadataValue extends GenericValue>(...args: DCommon.Or<[
        DCommon.IsEqual<GenericValue, unknown>,
        DCommon.IsEqual<GenericValue, never>,
        DCommon.IsExtends<undefined, GenericValue>
    ]> extends true ? [value?: GenericMetadataValue] : [value: GenericMetadataValue]): Metadata<GenericName, GenericMetadataValue>;
    is(input: unknown): input is Metadata<GenericName, any>;
    getValue(input: Metadata<GenericName, GenericValue>): GenericValue;
}
export declare function createMetadata<GenericName extends string, GenericValue extends unknown = unknown>(name: GenericName): MetadataHandler<GenericName, GenericValue>;
