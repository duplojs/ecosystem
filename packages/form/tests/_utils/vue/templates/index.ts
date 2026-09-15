import { createTemplate, type Templates } from "@V/template";
import CheckTemplate from "./CheckTemplate.vue";
import FormTemplate from "./FormTemplate.vue";
import InputTemplate from "./InputTemplate.vue";
import MultiTemplate from "./MultiTemplate.vue";
import RepeatTemplate from "./RepeatTemplate.vue";
import SectionTemplate from "./SectionTemplate.vue";
import StepTemplate from "./StepTemplate.vue";
import UnionTemplate from "./UnionTemplate.vue";

export const testTemplates: Templates = {
	check: createTemplate("check", CheckTemplate)(),
	form: createTemplate("form", FormTemplate)(),
	input: createTemplate("input", InputTemplate)(),
	multi: createTemplate("multi", MultiTemplate)(),
	repeat: createTemplate("repeat", RepeatTemplate)(),
	section: createTemplate("section", SectionTemplate)(),
	step: createTemplate("step", StepTemplate)(),
	union: createTemplate("union", UnionTemplate)(),
};
