import { createTemplate, type Templates } from "@V/template";

import "./grid.scss";
import { GridCheckTemplate, GridFormTemplate, GridInputTemplate, GridMultiTemplate, GridRepeatTemplate, GridSectionTemplate, GridStepByStepTemplate, GridUnionTemplate } from "./components";
import { type FormTemplateProperties } from "@V/form";
import type * as DCommon from "@duplojs/lang/common";
import { type InputTemplateProperties } from "@V/input";
import { type SectionTemplateProperties, type CheckTemplateProperties, type MultiTemplateProperties, type RepeatTemplateProperties, type StepTemplateProperties, type UnionTemplateProperties } from "@V/layouts";

export type * from "./types";
export * from "./components";

export interface CreateGridTemplatesInput {
	form?: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridFormTemplate>["$props"],
			keyof FormTemplateProperties["props"]
		>
	>;
	input?: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridInputTemplate>["$props"],
			keyof InputTemplateProperties["props"]
		>
	>;
	multi?: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridMultiTemplate>["$props"],
			keyof MultiTemplateProperties["props"]
		>
	>;
	check?: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridCheckTemplate>["$props"],
			keyof CheckTemplateProperties["props"]
		>
	>;
	section?: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridSectionTemplate>["$props"],
			keyof SectionTemplateProperties["props"]
		>
	>;
	repeat: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridRepeatTemplate>["$props"],
			keyof RepeatTemplateProperties["props"]
		>
	>;
	step: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridStepByStepTemplate>["$props"],
			keyof StepTemplateProperties["props"]
		>
	>;
	union: DCommon.SimplifyTopLevel<
		Omit<
			InstanceType<typeof GridUnionTemplate>["$props"],
			keyof UnionTemplateProperties["props"]
		>
	>;
}

export function createGridTemplates(
	params: CreateGridTemplatesInput,
) {
	const useFormTemplate = createTemplate(
		"form",
		GridFormTemplate,
		{ props: params.form },
	);
	const useInputTemplate = createTemplate(
		"input",
		GridInputTemplate,
		{ props: params.input },
	);
	const useMultiTemplate = createTemplate(
		"multi",
		GridMultiTemplate,
		{ props: params.multi },
	);
	const useCheckTemplate = createTemplate(
		"check",
		GridCheckTemplate,
		{ props: params.check },
	);
	const useRepeatTemplate = createTemplate(
		"repeat",
		GridRepeatTemplate,
		{ props: params.repeat },
	);
	const useUnionTemplate = createTemplate(
		"union",
		GridUnionTemplate,
		{ props: params.union },
	);
	const useStepByStepTemplate = createTemplate(
		"step",
		GridStepByStepTemplate,
		{ props: params.step },
	);
	const useSectionTemplate = createTemplate(
		"section",
		GridSectionTemplate,
		{ props: params.section },
	);

	return {
		useFormTemplate,
		useInputTemplate,
		useMultiTemplate,
		useCheckTemplate,
		useRepeatTemplate,
		useUnionTemplate,
		useStepByStepTemplate,
		useSectionTemplate,

		useTemplates: (): Templates => ({
			check: useCheckTemplate(),
			form: useFormTemplate(),
			input: useInputTemplate(),
			multi: useMultiTemplate(),
			repeat: useRepeatTemplate(),
			section: useSectionTemplate(),
			step: useStepByStepTemplate(),
			union: useUnionTemplate(),
		}),
	};
}
