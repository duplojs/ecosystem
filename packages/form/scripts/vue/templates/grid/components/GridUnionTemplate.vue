<script setup lang="ts">
import { computed } from "vue";
import type { UnionTemplateProperties } from "@V/layouts";
import type { GridTemplateLayoutContainerProps } from "../types";
import type { FunctionSelectInputComponent } from "@V/types";

export type Props = (
	& UnionTemplateProperties["props"]
	& GridTemplateLayoutContainerProps
	& {
		labels?: Record<string, string>;
		selectInputKind: FunctionSelectInputComponent;
	}
);

const props = withDefaults(
	defineProps<Props>(),
	{ },
);

const emit = defineEmits<UnionTemplateProperties["emits"]>();

defineSlots<UnionTemplateProperties["slots"]>();

const options = computed(
	() => props.kinds.map(
		(value) => ({
			value,
			label: props.labels?.[value] ?? value,
		}),
	),
);

const modelValue = computed({
	get: () => props.getCurrentKind(),
	set: (value) => {
		emit("changeKind", value);
	},
});

const containerStyles = computed(() => ({
	"--DFV-grid-max-columns": props.maxColumns,
	"--DFV-grid-gap": props.gap !== undefined ? `${props.gap}px` : undefined,
}));

const selfStyles = computed(() => ({
	"--DFV-grid-columns": props.columns,
}));
</script>

<template>
	<div
		class="DFV-grid-element"
		:style="selfStyles"
	>
		<div class="DFV-grid-union-select">
			<component
				:is="props.selectInputKind"
				:field-key="props.fieldKey"
				:options
				v-model="modelValue"
			/>
		</div>

		<div
			class="DFV-grid-container"
			:style="containerStyles"
		>
			<slot name="formField" />
		</div>
	</div>
</template>
