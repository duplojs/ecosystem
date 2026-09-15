<script setup lang="ts">
import { computed } from "vue";
import type { CheckTemplateProperties } from "@V/layouts";
import type { GridTemplateLayoutContainerProps } from "../types";

export type Props = (
	& CheckTemplateProperties["props"]
	& GridTemplateLayoutContainerProps
	& {
		hideEmptyMessageError?: boolean;
	}
);

const props = defineProps<Props>();

defineSlots<CheckTemplateProperties["slots"]>();

const selfStyles = computed(() => ({
	"--DFV-grid-columns": props.columns,
	"--DFV-grid-gap": props.gap !== undefined ? `${props.gap}px` : undefined,
}));

const containerStyles = computed(() => ({
	"--DFV-grid-max-columns": props.maxColumns,
	"--DFV-grid-gap": props.gap !== undefined ? `${props.gap}px` : undefined,
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
			<slot name="formField" />
		</div>

		<small
			class="DFV-grid-error"
			v-if="props.getErrorMessage() !== null || props.hideEmptyMessageError !== true"
		>
			{{ props.getErrorMessage() }}
		</small>
	</div>
</template>
