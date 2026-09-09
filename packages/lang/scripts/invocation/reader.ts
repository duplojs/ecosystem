import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DObject from "../object";
import * as DArray from "../array";
import * as DString from "../string";
import { type PortHandler } from "./port";
import { createKind } from "./kind";

export type ReaderDependencies = Record<
	string,
	Reader | PortHandler
>;

export type ReaderDependenciesValue<
	GenericDependencies extends ReaderDependencies,
> = DCommon.SimplifyTopLevel<{
	[
	Prop in keyof GenericDependencies as Uncapitalize<Extract<Prop, string>>
	]: GenericDependencies[Prop] extends PortHandler
		? ReturnType<GenericDependencies[Prop]["createImplementation"]>
		: GenericDependencies[Prop] extends Reader
			? ReturnType<GenericDependencies[Prop]["run"]>
			: never
}>;

export type GetAllPorts<
	GenericDependenciesValue extends ReaderDependencies,
> = GenericDependenciesValue extends any
	? ({
		[Prop in keyof GenericDependenciesValue]: (
			GenericDependenciesValue[Prop] extends PortHandler
				? [
					Uncapitalize<Extract<Prop, string>>,
					ReturnType<
						GenericDependenciesValue[Prop]["createImplementation"]
					>,
				]
				: GenericDependenciesValue[Prop] extends Reader
					? GetAllPorts<GenericDependenciesValue[Prop]["dependencies"]>
					: never
		)
	})[keyof GenericDependenciesValue]
	: never;

export const readerKind = createKind("reader");

export interface Reader<
	GenericDependencies extends ReaderDependencies = any,
	GenericOutput extends unknown = unknown,
> extends DKind.Kind<typeof readerKind> {
	dependencies: GenericDependencies;

	run(
		ports: DCommon.SimplifyTopLevel<
			& (
				GetAllPorts<
					GenericDependencies
				> extends infer InferredEntriesDependenciesValue extends DCommon.ObjectEntry
					? {
						[
						Entry in InferredEntriesDependenciesValue as Entry[0]
						]: Entry[1]
					}
					: never
			)
			& (
				{
					[
					Prop in keyof GenericDependencies as
					GenericDependencies[Prop] extends Reader
						? Uncapitalize<Extract<Prop, string>>
						: never
					]?: GenericDependencies[Prop] extends Reader
						? ReturnType<GenericDependencies[Prop]["run"]>
						: never
				}
			)
		>
	): GenericOutput;
}

export function createReader<
	const GenericDependencies extends ReaderDependencies,
	GenericOutput extends unknown,
>(
	dependencies: GenericDependencies,
	read: (
		dependenciesValue: ReaderDependenciesValue<GenericDependencies>,
	) => GenericOutput,
): Reader<
	GenericDependencies,
	GenericOutput
> {
	return {
		dependencies,
		run: (injectedDependencies: Record<string, unknown>) => read(
			DCommon.pipe(
				DCommon.forward<ReaderDependencies>(dependencies),
				DObject.entries,
				DArray.map(
					([key, value]) => {
						const formattedKey = DString.uncapitalize(key);

						return DObject.entry(
							formattedKey,
							readerKind.has(value) && !injectedDependencies[formattedKey]
								? value.run(injectedDependencies as never)
								: injectedDependencies[formattedKey]!,
						);
					},
				),
				DObject.fromEntries,
			) as never,
		),
		[readerKind.runTimeKey]: null,
	} satisfies DKind.Remove<Reader> as never;
}

export function resolveReaders<
	GenericReaders extends Record<string, Reader>,
>(
	readers: GenericReaders,
	ports: DCommon.SimplifyTopLevel<
		DCommon.UnionToIntersection<
			{
				[Prop in keyof GenericReaders]: GetAllPorts<
					GenericReaders[Prop]["dependencies"]
				> extends infer InferredEntriesDependenciesValue extends DCommon.ObjectEntry
					? {
						[
						Entry in InferredEntriesDependenciesValue as Entry[0]
						]: Entry[1]
					}
					: never
			}[keyof GenericReaders]
		>
	>,
): ReaderDependenciesValue<GenericReaders> {
	return DCommon.pipe(
		readers,
		DObject.entries,
		DArray.map(
			([key, reader]) => DObject.entry(
				DString.uncapitalize(key),
				reader.run(ports as never),
			),
		),
		DObject.fromEntries,
	) as never;
}
