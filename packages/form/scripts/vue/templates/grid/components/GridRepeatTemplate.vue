<script setup lang="ts">
import { computed } from "vue";
import type { RepeatTemplateProperties } from "@V/layouts";
import type { GridTemplateLayoutContainerProps } from "../types";
import type { FunctionButtonComponent } from "@V/types";

export type Props = (
	& RepeatTemplateProperties["props"]
	& GridTemplateLayoutContainerProps
	& {
		repeatElementColumn?: number;
		repeatElementMaxColumn?: number;
		removeButton: FunctionButtonComponent;
		removeLabel?: string;
		addButton: FunctionButtonComponent;
		addLabel?: string;
		resetButton: FunctionButtonComponent;
		resetLabel?: string;
	}
);

const props = withDefaults(
	defineProps<Props>(),
	{
		addLabel: "Add",
		removeLabel: "Remove",
		resetLabel: "Reset",
	},
);

const emit = defineEmits<RepeatTemplateProperties["emits"]>();

defineSlots<RepeatTemplateProperties["slots"]>();

const selfStyles = computed(() => ({
	"--DFV-grid-columns": props.columns,
}));

const containerStyles = computed(() => ({
	"--DFV-grid-max-columns": props.maxColumns,
	"--DFV-grid-gap": props.gap !== undefined ? `${props.gap}px` : undefined,
}));

const repeatElementStyles = computed(() => ({
	"--DFV-grid-columns": props.repeatElementColumn,
}));

const repeatElementContainerStyles = computed(() => ({
	"--DFV-grid-max-columns": props.repeatElementMaxColumn,
}));
</script>

<template>
	<div
		class="DFV-grid-element"
		:style="selfStyles"
	>
		<div
			class="DFV-grid-container"
			:style="containerStyles"
		>
			<div
				class="DFV-grid-element DFV-grid-repeat-element"
				v-for="(formField, index) in getFormFields()"
				:key="index"
				:style="repeatElementStyles"
			>
				<div class="DFV-grid-repeat-actions">
					<component
						:is="props.resetButton"
						:label="props.resetLabel"
						@click="emit('resetElement', index)"
					/>

					<component
						:is="props.removeButton"
						:label="props.removeLabel"
						:disabled="props.min === props.getFormFieldsQuantity()"
						@click="emit('removeElement', index)"
					/>
				</div>

				<div
					class="DFV-grid-container DFV-grid-repeat-container"
					:style="repeatElementContainerStyles"
				>
					<component :is="formField" />
				</div>
			</div>
		</div>

		<div class="DFV-grid-repeat-add">
			<component
				:is="props.addButton"
				:label="props.addLabel"
				:disabled="props.max === props.getFormFieldsQuantity()"
				@click="emit('addElement')"
			/>
		</div>
	</div>
</template>
