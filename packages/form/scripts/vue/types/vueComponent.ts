import type * as DCommon from "@duplojs/lang/common";
import type { EmitsToProps, EmitFn } from "vue";

export interface VueComponentParams {
	props?: Record<string, unknown>;
	emits?: Record<string, DCommon.AnyFunction | any[]>;
	expose?: object;
	slots?: Record<string, DCommon.AnyFunction<[any]>>;
}

export type VueComponent<
	GenericParams extends VueComponentParams = {},
> = new (...args: any) => VueComponentInstance<GenericParams>;

export type VueComponentInstance<
	GenericParams extends VueComponentParams = {},
> = DCommon.SimplifyTopLevel<
	& {
		$props: (
			& (
				DCommon.Or<[
					DCommon.IsEqual<GenericParams["props"], unknown>,
					DCommon.IsExtends<GenericParams["props"], undefined>,
				]> extends true
					? {}
					: GenericParams["props"]
			)
			& (
				GenericParams["emits"] extends Record<string, unknown[]>
					? EmitsToProps<{
						[Prop in keyof GenericParams["emits"]]: (...args: GenericParams["emits"][Prop]) => void
					}>
					: GenericParams["emits"] extends object
						? EmitsToProps<
							GenericParams["emits"]
						>
						: {}
			)
		);
		$emit: GenericParams["emits"] extends object
			? EmitFn<
				GenericParams["emits"]
			>
			: EmitFn<{}>;
		$slots: GenericParams["slots"] extends object
			? GenericParams["slots"]
			: {};
	}
	& (
		DCommon.Or<[
			DCommon.IsEqual<GenericParams["expose"], unknown>,
			DCommon.IsExtends<GenericParams["expose"], undefined>,
		]> extends true
			? {}
			: GenericParams["expose"]
	)
>;
